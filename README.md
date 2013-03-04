# stability

tool to add a stability message to README.

see [node.js stability index](http://nodejs.org/api/documentation.html#documentation_stability_index)

# Stability

Stable: Expect patches, possible features additions.

## Usage

```
npm install -g stability

cd your-module

# output what the README would look like with a stability message.

stability stable --dry

# update the README

stability stable

# make a git commit.

stability stable --commit

```



## License

MIT
