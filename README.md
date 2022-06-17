# Fake Cats NFT

APIs for a fake NFT platforms dedicated to cats

## Development Setup

### Install

- [Docker 19.x.x](https://docs.docker.com/install/)
- [Docker Compose 1.24.x](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [Node 10.x.x](https://nodejs.org)
- [NPM 6.x.x](https://nodejs.org)
- [Mysql 8.x.x](https://mysql.com/)


### Steps

- Clone repository - SSH or HTTPS

	```
	git clone https://github.com/joemarieSelorio/fake-cat-nft.git
	```

- Access application directory

	```
	cd fake-cat-nft
	```

- Copy the sample config and update as necessary

	```
	cp sample.env .env
	vim .env
	```

- Running the application

	- Run the application manually
		- Install dependencies

			```
			npm install
			```
		- Setup database for the first time

			```
			npm run db:latest
			```

		- Start

			Recommended:

			```
			npm start
			```

			For watching file changes for development:

			```
			npm run start:dev
			```

			Bypass checks, file watching and auto-generation:

			```
			node app.js
			```

	- Run the application via docker-compose

		*Note:*
		* In your env file, change the following records:
			- MYSQL_HOST - set it as `docker.for.mac.localhost` for mac and `host.docker.internal` for windows if deploying using docker locally

		- Start

			```
			docker-compose up -d
			```

		- Setup database for the first time

			```
			docker-compose exec fake-cat-nft npm run db:latest
			```


- Check if application is running

	```
	curl http://<HOST>:<PORT>/
	```

- Run tests

	Lint:

	```
	npm run lint
	```

	Lint with auto fix:

	```
	npm run lint:fix
	```

	Unit tests:

	```
	npm run test:unit
	```

	Integration tests:

  * In your env file, change the following records and run the db migration

    - NODE_ENV - set it as `test`
    - npm run db:latest

	```
	npm run test:integration
	```

  * Once finished you can reset the NODE_ENV value again

## Documentation
- [Postman Collection](api/postman)


## License
