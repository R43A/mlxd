# cli/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/cli
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Install Python for inference
RUN apk add --no-cache python3 py3-pip

# (Optional) pip install scikit-learn, numpy
RUN pip3 install numpy scikit-learn

CMD ["npx", "ts-node", "src/index.ts", "run"]
