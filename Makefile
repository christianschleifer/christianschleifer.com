.PHONY: dev build clean

build:
	hugo

dev:
	docker-compose up --build

clean:
	rm -rf public
