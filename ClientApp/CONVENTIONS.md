# Client conventions

A list of conventions that should be followed while writing the code.

## Global components

Every global component should start with the acronym "REP".

A global component is meant to be used everywhere and should not
be project dependant.

Using services in global components is forbidden.

examples:
    <rep-example></rep-example>
    REPExampleComponent


## Project related components

Every project related component should start with the acronym "MTD" (Mounted).

examples:
    <mtd-example></mtd-example>
    MTDExampleComponent

## Services

Services starts with the _ and should not contain the "service" word in it.

example:
    constructor(
      private _utils: UtilsService
    ) { }

