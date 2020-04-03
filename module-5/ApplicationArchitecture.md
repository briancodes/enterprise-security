# Application Architecture

Source code (not mono-repo)

- https://github.com/bartosz-io/budget-angular

- https://github.com/bartosz-io/budget-node

Deployed version (with mock in-memory Web API):

- https://budget.angular-academy.com

Discussion of the Facade Service Pattern

- https://angular-academy.com/angular-architecture-best-practices/#abstraction-layer

## Overview - Entities & Roles

[Link to Course](https://angular-academy.teachable.com/courses/751289/lectures/14910706)

#### Entities: 

- Expenses
- Budgets
- Categories

#### Roles: 

**User** - Read Expenes/Budgets/Categories

**Owner** - CRUD Expenes/Budgets/Categories

**Admin** - Mangae Users

**System** - CRUD any Expenses (scheduled or triggered process)

## Application Architecture

- Modular
- Container & Presentation Components
- Facade (supposedly an abstraction of API & State)
- API & State Services

## Authentication & Authorization

- Authentication - user identity and login credentials
- Authorization - grant access to system resources
    - Access Control - protect system resourses from unauthorized access

#### Access Control Models

- Mandatory Access Control (MAC) strictest of all levels
    - Admin controls access to everything
- Discretionary Access Control (DAC) 
    - Access Control List updated by user
- Many others......

We'll be using: 

- Role Based Access Control (RBAC)

#### Role Based Access Control 

- Vectors of authorization
    - Ownership: of entities e.g. budget, expenses, categories
    - Role: CRUD access to the entities

Other rules might include access to other user's accounts (but not in our demo project)

## Secured Angular (UX secured)

- canActivate Route Guard on `/login` path 
    - redirect if already logged in
- canActivate Route Guard on `/app` which has `children` of all other routes 
    - redirect to `login` if not logged in

> Lazy Loaded modules with `canLoad` (to be discussed in next modules) 

## Secured Node (implementation)

- Authentication middleware
- JWT with `passport.js`
- Authorization middleware

## Node.js TypeScript Application Setup

- `nodemon` with `nodemon.json` configuration 
- `tsconfig.json`
- `@types` in `devDependencies`




