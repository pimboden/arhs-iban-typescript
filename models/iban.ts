import { iso13616Prepare, iso7064Mod97_10, parseStructure } from '~/utils/iban'
 export class Specification{
/**
     * Create a new Specification for a valid IBAN number.
     *
     * @param countryCode the code of the country
     * @param length the length of the IBAN
     * @param structure the structure of the underlying BBAN (for validation and formatting)
     * @param example an example valid IBAN
     * @constructor
     */

  _cachedRegex :RegExp

  constructor(public countryCode:string,public length:number,public structure:string,public example:string)
  {}
      /**
     * Lazy-loaded regex (parse the structure and construct the regular expression the first time we need it for validation)
     */
  _regex = () =>{
    return this._cachedRegex || (this._cachedRegex = parseStructure(this.structure)) 
  }  


   /**
     * Check if the passed iban is valid according to this specification.
     *
     * @param {String} iban the iban to validate
     * @returns {boolean} true if valid, false otherwise
     */
    isValid = (iban : string )=>{
      return this.length == iban.length
          && this.countryCode === iban.slice(0,2)
          && this._regex().test(iban.slice(4))
          && iso7064Mod97_10(iso13616Prepare(iban)) == 1;
  };

  /**
     * Convert the passed IBAN to a country-specific BBAN.
     *
     * @param iban the IBAN to convert
     * @param separator the separator to use between BBAN blocks
     * @returns {string} the BBAN
     */
    toBBAN = (iban:string , separator:string) => this._regex().exec(iban.slice(4))!.slice(1).join(separator);


   /**
     * Convert the passed BBAN to an IBAN for this country specification.
     * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
     * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
     *
     * @param bban the BBAN to convert to IBAN
     * @returns {string} the IBAN
     */
    fromBBAN = (bban:string) => {
      if (!this.isValidBBAN(bban)){
          throw new Error('Invalid BBAN');
      }

      var remainder = iso7064Mod97_10(iso13616Prepare(this.countryCode + '00' + bban)),
          checkDigit = ('0' + (98 - remainder)).slice(-2);

      return this.countryCode + checkDigit + bban;
  };
   /**
     * Check of the passed BBAN is valid.
     * This function only checks the format of the BBAN (length and matching the letetr/number specs) but does not
     * verify the check digit.
     *
     * @param bban the BBAN to validate
     * @returns {boolean} true if the passed bban is a valid BBAN according to this specification, false otherwise
     */
    isValidBBAN = (bban:string) => {
      return this.length - 4 == bban.length
          && this._regex().test(bban);
  };
}