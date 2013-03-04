# stability

tool to add a stability message to README.

see [node.js stability index](http://nodejs.org/api/documentation.html#documentation_stability_index)

# Stability

Stable: Expect patches, possible features additions.

## Examples

```
npm install -g stability

cd your-module

# output what the README would look like with a stability message.

stability stable --dry

# update the README & package.json

stability stable --package --readme

# make a git commit.

stability stable --commit

# update README, package.json and git commit 

stability stable --all

# or...

stability stable -a

```

## Usage

```
stability STABILITY_LEVEL [options]
options:
-r, --readme    # add stability message to readme.
-p, --package   # add stability message to package.
-c, --commit    # commit stability messages
-a, --all       # all of the above.
-d, --dry       # preview the above changes on stdout only.
                # do not make changes! 
-h, --help      # display this message
```

## Levels of Stability

Defined [here](https://github.com/dominictarr/stability/blob/master/levels.json)

### Depreciated

Expect no more changes. Avoid using this module.

### Experimental

Expect the unexpected. Please provide feedback on api and your use-case.

### Unstable

Expect patches and features, possible api changes.

### Stable

Expect patches, possible features additions.

### Frozen

Expect only patches. Please do not make feature requests.

### Locked

Expect no changes, except serious bugs. Please do not make feature requests.

## License

MIT
