#Descriptiom

this is the  Typescript version of the https://github.com/arhs/iban.js 


It can be uses in frameworks like nuxt / vue /react.


For example in a nuxt composable

```
import * as IBAN from '~/utils/iban'
export const useIban= () => {


const isValid =(iban : string ) => IBAN.isValid(iban)

  return {
    isValid
  }
}
```
