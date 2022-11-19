type SpotifyUserProfile = {
	id: string;
	display_name: string;
	email?: string;
	product: string;
	country: string;
	href: string;
	explicit_content: {
		filter_enabled: boolean;
		filter_locked: boolean;
	};
	external_urls: {
		spotify: string;
	};
	followers: {
		href: string | null;
		total: number;
	};
	images: SpotifyUserProfile_Image[];
	type: string;
	uri: string;
}

type SpotifyUserProfile_Image = {
	height: number | null;
	url: string;
	width: number | null;
}