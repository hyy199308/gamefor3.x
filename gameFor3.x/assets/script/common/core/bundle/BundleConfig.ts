export default class BundleConfig {
	private static _instance: BundleConfig = null!;

	static get instance(): BundleConfig {
		return (BundleConfig._instance ? BundleConfig._instance : (BundleConfig._instance = new BundleConfig()));
	}

	// start >>>>>>
	BundleName = {
		game: {
			prefab: {
			},
			sound: {

			},
			preload: {

			},
			texture: {

			},
		},
	}
	// end >>>>>>
}
