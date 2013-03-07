#! /usr/bin/env node

var fs = require('fs')
var sections = require('markdown-sections')
var opts     = require('optimist')
  .alias('r', 'readme')
  .alias('a', 'all')
  .alias('p', 'package')
  .alias('c', 'commit')
  .alias('d', 'dry')
  .argv

var exec     = require('child_process').exec

function usage () {
  console.error(
    [ 'stability STABILITY_LEVEL [options]'
    , 'options:'
    , '-r, --readme    # add stability message to readme.'
    , '                # defaults to true, disable with --no-readme'
    , '-p, --package   # add stability message to package.'
    , '-c, --commit    # commit stability messages'
    , '-a, --all       # all of the above.'
    , '-d, --dry       # preview the above changes on stdout only.'
    , '                # do not make changes! '
    , '-h, --help      # display this message'
    , ''
    , 'STABILITY_LEVEL must be one of:'
    , 'depreciated, experimental, unstable, stable, frozen, locked'
    , ''
    , 'see https://github.com/dominictarr/stability for more info'
    ].join('\n')
  )
  process.exit(1)
}

if(opts.h || opts.help) usage()
if(opts.all)
  opts.readme = opts.commit = opts.package = true

var readme = fs.readdirSync('./')
  .filter(function (name) {
    return /^readme\.(md|markdown)$/.test(name.toLowerCase())
  })
  .shift()

var text = fs.readFileSync(readme, 'utf-8')

var a = sections(text)

function findLast (array, test) {
  var i = null
  //find the stability section
  array.forEach(function (v, j) {
    if(test(v, j))
      i = j
  })

  return i
}

var i = findLast(a, function (section, j) {
    return /^#+\s*stability/.test(section.toLowerCase())
  })

var stability = opts._[0]

var descriptions = require('./levels.json')
var levels = Object.keys(descriptions)

var k = stability && findLast(levels, function (level) {
  return level.toLowerCase().indexOf(stability.toLowerCase()) === 0
})

if(k == null) usage()

a.splice(
  i == null ? 1 : i,
  i == null ? 0 : 1, 
  [ '## Stability',
    '',
    levels[k] + ': ' + descriptions[levels[k]],
    ''
  ].join('\n')
)

var newText = a.join('\n')

var p = JSON.parse(fs.readFileSync('./package.json', 'utf8'))

p.stability = levels[k].toLowerCase()
p = JSON.stringify(p, false, 2) + '\n'

if(opts.dry) {
  if(opts.readme)
    console.log(newText)
  if(opts.package)
    console.log(p)
  return
}

if(opts.package)
  fs.writeFileSync('./package.json', p)

if(opts.readme)
  fs.writeFileSync(readme, newText)

if(opts.commit)
  exec('git commit ' + readme + ' package.json -m "Stability: ' + levels[k] + '"')

