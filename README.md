## Reto role full stack - Juan Conrado
### Repositorio Backend 

Para la realización del reto, se hace uso de los siguientes recursos:

* Se utiliza ExpressJS
* Se utiliza TypeORM
* Se utiliza PostgreSQL como base de datos
* Se abilita cache de queries usando redis
* El despliegue se realiza por medio de contenedores en el servicio de EC2 de AWS

### Rutas disponibles:

* /api/auth
* - POST /api/auth/login
* - POST /api/auth/sign-up
* - GET /api/auth/logout
* /api/user
* - GET /api/user/info
* - GET /api/user/products
* /api/product
* - POST /api/product/create
* - GET /api/product/get-one/:id
* - PATCH /api/product/update/:id
* - DELETE /api/product/delete/:id
* - POST /api/product/search
* /api/category
* - POST /api/category/create
* - GET /api/category/list

### Rutas protegidas: 

Se necesita autenticación para las siguientes rutas:

* /api/user
* /api/product
* /api/category

**Notas:**

* Se usa autenticación por medio de cookies.
* Se usa JWT como estratégia de autenticación.
* El servicio de autenticación es simple.
* No se tiene en cuenta mayores preocupaciones en temas de seguridad.

Juan David Conrado Pertuz