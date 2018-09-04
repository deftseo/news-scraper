

.PHONY: install update-economist

install: data/ node_modules/

update-economist: data/economist/

data/economist: data/
	mkdir data/economist

node_modules/:
	npm install

data/:
	mkdir data


