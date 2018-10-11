# Node.js Masterclass Homework Assignment

This repository contains the homework assignment for [Node.js Master Class](https://pirple.thinkific.com/courses/the-nodejs-master-class) by [Pirple](https://pirple.thinkific.com/) that is focused on building a RESTful API, web app GUI, and a CLI in plain Node JS (ES6 Javascript) with **no NPM or 3rd-party libraries**.

![](/src/assets/images/screenshots/nodejs-logo.png)

## Homework Assignments

### Assignment #1: Backend

You are building the API for a **pizza-delivery company**.

Here's the spec from your project manager: 

1. **New users** can be created, their information can be edited, and they can be deleted. We should store their *name*, *email address*, and *street address*.
2. Users can **log in** and **log out** by creating or destroying a token.
3. When a user is logged in, they should be able to **GET all the possible menu items** (these items can be hardcoded into the system). 
4. A logged-in user should be able to **fill a shopping cart with menu items**
5. A logged-in user should be able to **create an order**. You should integrate with the Sandbox of [Stripe.com](https://stripe.com/) to accept their payment. _Note:_ Use the stripe sandbox for your testing. [Follow this link](https://stripe.com/docs/testing#cards) and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working.
6. When an order is placed, you should **email the user a receipt**. You should integrate with the sandbox of [Mailgun.com](https://www.mailgun.com/) for this. _Note:_ Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task. [Read more here](https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account).

### Assignment #2: Frontend

It is time to build a **simple frontend** for the Pizza-Delivery API you created in Homework Assignment #2. Please create a web app that allows customers to:

1. **SignUp** on the site.
2. **View all the items** available to order.
3. **Fill up a shopping cart**.
4. **Place an order** (with [fake credit card credentials](https://stripe.com/docs/testing#cards)), and receive an email receipt

### Assignment #3: Admin CLI

It is time to build the **Admin CLI** for the pizza-delivery app you built in the previous assignments. Please build a CLI interface that would allow the manager of the pizza place to:

1. View all the **current menu items**.
2. View all the **recent orders** in the system (orders placed in the last 24 hours).
3. Lookup the **details of a specific order** by order ID.
4. View all the **users** who have signed up in the last 24 hours.
5. Lookup the details of a **specific user** by email address.

## The Solution

### Launching the Server

Too launch the application please run the following command from the project root folder:

```bash
node index.js
```

You may also run the application in debugging mode:

```bash
env NODE_DEBUG=server,stripe,mailgun,cli,workers node index.js
```

Running the APP for different environments:

```bash
NODE_ENV=staging node index.js
```

The APP is currently supporting `staging` (default) and `production` environments.

### CLI Commands

The following CLI command are available for the execution:

```Text
-----------------------------------------------------------------------------------------------------------
                               CLI Manual
-----------------------------------------------------------------------------------------------------------

exit                           Kill the CLI (and the rest of the application)

man                            Show this help page

help                           Alis of the "man" command

menus                          Show the list of available menu items (pizzas)

orders                         View all the recent orders in the system (orders placed in the last 24 hours)

order --{orderId}              Lookup the details of a specific order by order ID

users                          View all the users who have signed up in the last 24 hours

user --{email}                 Lookup the details of a specific user by email address

-----------------------------------------------------------------------------------------------------------
```

### Front-End

The following paths are available for the user in browser after launching the app.

#### Index Page

Path: `http://localhost:3000/`

![](/src/assets/images/screenshots/01-index.png)

#### Login Page

Path: `http://localhost:3000/user/session/create`

![](/src/assets/images/screenshots/02-login.png)

#### Menu List

Path: `http://localhost:3000/menu/list`

![](/src/assets/images/screenshots/03-menu.png)

#### Shopping Cart

Path: `http://localhost:3000/user/cart/read`

![](/src/assets/images/screenshots/04-cart.png)

#### Checkout Page

Path: `http://localhost:3000/user/order/create`

![](/src/assets/images/screenshots/05-checkout.png)

#### Checkout Success Page

Path: `http://localhost:3000/user/order/success`

![](/src/assets/images/screenshots/06-success.png)

#### User Profile Page

Path: `http://localhost:3000/user/account/edit`

![](/src/assets/images/screenshots/07-profile.png)

### Back-End (API)

The following endpoints are available from API perspective.

#### HealthCheck Endpoint

Request example:

```bash
curl -X GET http://localhost:3000/ping
```

#### User Endpoints

##### Create the User

Request example:

```bash
curl -X POST \
  http://localhost:3000/users \
  -d '{
	"name": "John",
	"email": "any@email.com",
	"password": "1111",
	"address": "San Francisco, CA",
	"streetAddress": "Sunset blvd, 15"
}'
```

##### Read the User

Request example:

```bash
curl -X GET \
  'http://localhost:3000/users?email=any@email.com' \
  -H 'token: 48df0wibmpqz69rzgb5y'
```

##### Update the User

Request example:

```bash
curl -X PUT \
  http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -H 'token: 48df0wibmpqz69rzgb5y' \
  -d '{
	"name": "Bill",
	"email": "any@email.com"
}'
```

##### Delete the User

Request example:

```bash
curl -X DELETE \
  'http://localhost:3000/users?email=any@email.com' \
  -H 'token: b3xg95c3wp0ol1pk46vm'
```

#### Token Endpoints

##### Create the Token

Request example:

```bash
curl -X POST \
  http://localhost:3000/tokens \
  -d '{
	"email": "any@email.com",
	"password": "1111"
}'
```

##### Read the Token

Request example:

```bash
curl -X GET 'http://localhost:3000/tokens?id=gjfek6ha08p2x8877mno'
```

##### Update (Prolong) the Token

Request example:

```bash
curl -X PUT \
  http://localhost:3000/tokens \
  -H 'Content-Type: application/json' \
  -d '{
	"id": "gjfek6ha08p2x8877mno"
}'
```

##### Delete the Token

Request example:

```bash
curl -X DELETE 'http://localhost:3000/tokens?id=bivegzlqhs1z5q4np0yo'
```

#### Menu Endpoint

##### Get the Menu

Request example:

```bash
curl -X GET \
  http://localhost:3000/menus \
  -H 'token: 3c3nld8owylf927r5txu'
```

#### Shopping Cart Endpoint

##### Create Shopping Cart

Request example:

```bash
  http://localhost:3000/carts \
  -H 'token: ket278eemafcehh9vq30'
```

##### Read Shopping Cart

Request example:

```bash
curl -X GET \
  http://localhost:3000/carts \
  -H 'token: ket278eemafcehh9vq30'
```

##### Delete Shopping Cart

Request example:

```bash
curl -X DELETE \
  http://localhost:3000/carts \
  -H 'token: ket278eemafcehh9vq30'
```

#### Update Items in Shopping Cart

Request example:

```bash
curl -X PUT \
  http://localhost:3000/carts \
  -H 'Content-Type: application/json' \
  -H 'token: sdvr4w4e85gw8slgycnt' \
  -d '{
	"id": 4,
	"quantity": 2
}
'
```

#### Order Endpoint

##### Create the Order

Request example:

```bash
curl -X POST \
  http://localhost:3000/orders \
  -H 'Content-Type: application/json' \
  -H 'token: 8l06rtpic4y4kps54pe4' \
  -d '{
	"paymentSource": "tok_mastercard"
}'
```

##### Read the Order

Request example:

```bash
curl -X GET \
  'http://localhost:3000/orders?id=un2yhgqoajzmv76fozkd' \
  -H 'token: 4dpj97yqr53druol20ru'
```
