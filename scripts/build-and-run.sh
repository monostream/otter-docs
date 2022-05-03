cd ..

docker build . -t otter-docs && docker run -p 8080:8080 --rm otter-docs