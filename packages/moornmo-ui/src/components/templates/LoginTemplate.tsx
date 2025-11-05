import { Flex } from '@falcon/components/common/Flex';
import {
	LoginFormComponent,
	LoginFormProps,
} from '@moornmo/components/organisms/LoginFormComponent';
interface LoginTemplateProps extends LoginFormProps {}

export const LoginTemplate: React.FC<LoginTemplateProps> = ({
	login,
	initialValues,
	hasLabel = false,
	layout = 'simple',
	useSignIn,
	signInFormConfig,
	signIn,
}) => (
	<>
		<Flex justifyContent="between" alignItems="center" className="mb-2">
			<h5>Log in</h5>
		</Flex>
		<LoginFormComponent
			login={login}
			initialValues={initialValues}
			hasLabel={hasLabel}
			layout={layout}
			useSignIn={useSignIn}
			signInFormConfig={signInFormConfig}
			signIn={signIn}
		/>
	</>
);
