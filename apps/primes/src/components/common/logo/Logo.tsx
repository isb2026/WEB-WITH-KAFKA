import logoImage from '@primes/assets/img/logos/1x1_logo.png';

const Logo = () => {
	return (
		<div className="flex items-center gap-3 mb-5">
			<div className="w-8 h-8 rounded flex items-center justify-center">
				<img
					src={logoImage}
					alt="무른모 로고"
					className="w-6 h-6 rounded-sm bg-background"
				/>
			</div>
			<span className="text-lg font-semibold text-foreground">
				무른모
			</span>
		</div>
	);
};

export default Logo;
