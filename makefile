include .env

.PHONY: up
up:
	chmod +x start.sh
	./start.sh
	docker-compose --env-file .env up -d
