# drepl

> Discord Javascript REPL bot w/ dynamic require

## Installation

```sh
$ npm install -g seanc/drepl
```

## Usage

```sh
$ drepl [--token] [--prefix]
```

### Example

```sh
$ drepl --token Mfa. --prefix ">>"
```

### Commands

```
!drepl `<code>`
```

Example
```
>> `function foo() { return 'bar' }`
```

or multiline

> \>>
```
function foo() {
  return 'bar'
}
```

make sure you include a space after your prefix, if you included one in the config

### Dynamic Require
DREPL is a tad bit special, it parses calls to the `require` function and will
automatically those dependencies, if they're not native to node.

Unfortunately, I haven't found a way to effectively silence the output from
installing these dependencies, so you'll just have to put up with it until I do
:(

## Configuration

Make sure a `.dreplrc` file exists,
an typical configuration should look like so:

```
token = Mfa.
prefix = !
```

Passing in command line parameters will override these values
## License

MIT © [Sean Wilson](https://imsean.me)
