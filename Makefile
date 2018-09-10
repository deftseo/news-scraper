

.PHONY: install update-economist update-reuters

install: data/ node_modules/

update-economist: data/economist/

data/economist: data/
	mkdir -p data/economist

update-reuters: data/reuters/

data/reuters/:
	mkdir -p data/reuters

node_modules/:
	npm install

data/:
	mkdir data


