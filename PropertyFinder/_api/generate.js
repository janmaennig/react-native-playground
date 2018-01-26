module.exports = function() {
	let faker = require( 'faker/locale/de' );
	let _ = require( 'lodash' );

	return {
		centers: _.times( 100, function( n ) {
			return {
				id: n + 1,
				name: faker.name.findName(),
				city: faker.address.city(),
				zip: faker.address.zipCode(),
				street: faker.address.streetName(),
				latitude: faker.address.latitude(),
				longitude: faker.address.longitude()
			}
		} )
	};
}
