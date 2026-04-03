# /schemas

## Schema Structure

A schema should be defined in a file containing two exports:

1. keys - Schema keys
2. schema - Valibot Schema

This is necessary to use the keys within forms, for example:
```html
<form>
    <input name={keys.name} />
<form>

```ts
export const keys = Object.freeze({
    "firstName": "firstName",
    "phone": "phone",
    "email": "email",
    "privacyPolicy": "privacyPolicy",
    "newsletterSubscription": "newsletterSubscription"
})

export const schema = v.object({
    [keys.firstName]: stringAndNonEmpty("Enter your name"),
    [keys.phone]: RussianPhoneSchema("Enter your phone number"),
    [keys.email]: EmailSchema(),
    [keys.privacyPolicy]: v.optional(v.literal(true, "You must agree to the privacy policy"), false as true),
    [keys.newsletterSubscription]: v.optional(v.literal(true)),
})
```

## Special Rules for Form Fields

When building forms, the schemas passed into them will be transformed (coerced) according to the rules described at the following link:
https://conform.guide/api/valibot/coerceFormValue

```
If the value is an empty string / file, pass undefined to the schema
If the schema is v.number(), trim the value and cast it with the Number constructor
If the schema is v.boolean(), treat the value as true if it equals to on (Browser default value of a checkbox / radio button)
If the schema is v.date(), cast the value with the Date constructor
If the schema is v.bigint(), trim the value and cast the value with the BigInt constructor
```

Suppose we have the following schema:

```ts
export const schema = v.object({
    [keys.firstName]: stringAndNonEmpty("Enter your name"),
    [keys.phone]: RussianPhoneSchema("Enter your phone number"),
    [keys.email]: EmailSchema(),
    [keys.privacyPolicy]: v.optional(v.literal(true, "You must agree to the privacy policy"), false as true),
    [keys.newsletterSubscription]: v.optional(v.literal(true)),
})
```

If the user does not check the checkbox, it will not appear in the FormData.
This means the schema will receive an object without this field.
Therefore, for required fields, you should specify v.optional(v.literal(true), false as true);.
This also reduces network overhead, as unnecessary fields will not be transmitted.
