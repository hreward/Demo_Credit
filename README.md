
# Demo_Credit

A mobile wallet for lenders. Sign, Automate, Relax


## Table of Content
Project and description

Table of Content

Usage/API Reference

Contributing

Github Profile

Support
## Usage / API Reference

API_BASE: **https://reward-lendsqr-be-test.mastpal.com**

#### Create User

```http
  PUT /users/create
```

| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required** |
| `password` | `string` | **Required** |
| `firstname` | `string` | **Required** |
| `lastname` | `string` | **Required** |


#### Update User

```http
  POST /users/update
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | *Optional* |
| `firstname` | `string` | *Optional* |
| `lastname` | `string` | *Optional* |


#### Delete User

```http
  DELETE /users/delete
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |

#### User Login

```http
  POST /auth/login
```
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required** user's email address |
| `password` | `string` | **Required** user's password |


#### User logout

```http
  GET /auth/logout
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |

#### Wallet balance

```http
  GET /wallets/balance
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |

#### Fund wallet

```http
  POST /wallets/addfunds
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `amount*` | `number` | **Required** amount to be added to wallet |
| `description` | `string` | *Optional* narration of the transaction |


#### Withdraw fund

```http
  POST /wallets/withdraw
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `amount` | `number` | **Required** amount to be withdrawn from wallet |
| `description` | `string` | *Optional* narration of the transaction |

#### Wallet to wallet transfer

```http
  DELETE /wallets/transfer
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `amount` | `number` | **Required** amount to transfer |
| `recipient_email` | `string` | **Required** recipient email |
| `narration` | `string` | *Optional* narration of the transaction |


#### Get user's transactions

```http
  GET /transactions
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |

#### Get User's transaction

```http
  GET /transactions/${id}
```
Authorization header <Bearer Token> is **required.** Where token is gotten as login endpoint call response. 
| Data | Type     | Description                |
| :-------- | :------- | :------------------------- |




## Contributing

Contributions are always welcome!

Please adhere to this project's `code of conduct`.


## 🚀 About Me
I'm a full stack developer...very proficient in backend developing.


## Support

This project is initiated and supported by Lendsqr - Signup, Automate, Relax.


## Tech Stack

**Server:** Node, Express, Typescript, MySQL, Knex

