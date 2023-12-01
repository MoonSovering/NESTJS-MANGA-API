<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>
## Description

An REST API with [Nest](https://github.com/nestjs/nest)

This API was created with the intention of allowing users to view mangas & comics, register, and log in to add mangas to their list of preferred mangas. The API also enables users with the “Partners” role to create Genres, Authors, and Chapters for their Mangas.

Decompress was used to allow Partners to upload a zip file containing all the images they wish to upload in a single file, and through the use of Sharp, a reduction of 70-80% in the size of the images uploaded by the Partners was achieved.

## API

API Swagger documentation:

  - **GET** - /api/docs

## Installation guide Github repository (Local environment)

1. Clone repository
2. Execute

```bash
$ yarn install
```

3. Add NestCLI
```bash
$ yarn add -g @nestjs/cli
```

4. Clone file __.env.template__ and rename to __.env__

5. Fill the missing fields of the __.env__ file

6. Up database PostgresSQL
```bash
docker-compse up -d
```

## Installation guide Docker image (Local environment)

1. Pull the API [Docker image](https://hub.docker.com/r/urranrell/nest-manga)
3. Clone file __.env.template__ and rename to __.env__
4. Fill the missing fields of the __.env__ file
5. Up database PostgresSQL
```bash
docker-compse up -d
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Stay in touch

- Author - [Armando Sanmartin]

## Stack use
* Nesjs
* PostgresSQL
* Sequelize
* AWS SES
* Cloudinary
* Docker

## License

Nest is [MIT licensed](LICENSE).
