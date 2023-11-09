import { helpers, maxLength, minLength, required } from '@vuelidate/validators';

export const usePartCopyDialogValidation = {
	name: {
		required,
		characters: helpers.withMessage('Invalid characters', helpers.regex(/^[a-zA-Z0-9]+(['"._\-a-zA-Z0-9 :;,\(\\+)@]*)*$/)),
		minLength: minLength(3),
		maxLength: maxLength(50),
		$autoDirty: true
	}
};
