import * as pluralize from 'pluralize'

/**
 * @Method: Returns the Plural form of any noun.
 * @Param {string}
 * @Return {string}
 */
export function getPlural (str: any) : string {
	return pluralize.plural(str)
}

/**
 * @Method: Returns the Singular form of any noun.
 * @Param {string}
 * @Return {string}
 */
export function getSingular (str: string) : string {
	return pluralize.singular(str)
}