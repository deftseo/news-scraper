

.PHONY: install

install: data/ node_modules/


node_modules/:
	npm install

data/:
	mkdir data


