<template>
	<VtFormDialog
		:label="$t('titles.copy') + ' ' + $t('forms.name')"
		:signal="signal"
		:button-ok-disabled-override="buttonOkDisabledOverride"
		:pre-complete-ok="preCompleteOk"
		:reset-additional="resetAdditional"
		:validation="validation"
		max-width="70vh"
		@close="dialogClose"
		@error="dialogError"
		@ok="dialogOk"
	>
		<VtTextFieldWithValidation
			ref="nameRef"
			v-model="name"
			vid="name"
			:label="$t('forms.name')"
			:maxcount="30"
			:validation="validation"
		/>
	</VtFormDialog>
</template>

<script>
import { useChecklistCopyDialogComponent } from '@/components/content/checklists/dialogs/checklistCopyDialogComponent';
import { useChecklistCopyDialogProps } from '@/components/content/checklists/dialogs/checklistCopyDialogProps';
import { useChecklistCopyDialogValidation } from '@/components/content/checklists/dialogs/checklistCopyDialogValidation';

import VtFormDialog from '@thzero/library_client_vue3_vuetify3/components/form/VtFormDialog';
import VtTextFieldWithValidation from '@thzero/library_client_vue3_vuetify3/components/form/VtTextFieldWithValidation';

export default {
	name: 'ChecklistCopyDialog',
	components: {
		VtFormDialog,
		VtTextFieldWithValidation
	},
	props: {
		...useChecklistCopyDialogProps
	},
	emits: ['close', 'ok'],
	setup (props, context) {
		const {
			correlationId,
			error,
			hasFailed,
			hasSucceeded,
			initialize,
			logger,
			noBreakingSpaces,
			notImplementedError,
			success,
			name,
			buttonOkDisabledOverride,
			dialogError,
			dialogClose,
			dialogOk,
			preCompleteOk,
			resetAdditional,
			scope,
			validation
		} = useChecklistCopyDialogComponent(props, context);

		return {
			correlationId,
			error,
			hasFailed,
			hasSucceeded,
			initialize,
			logger,
			noBreakingSpaces,
			notImplementedError,
			success,
			name,
			buttonOkDisabledOverride,
			dialogError,
			dialogClose,
			dialogOk,
			preCompleteOk,
			resetAdditional,
			scope,
			validation
		};
	},
	validations () {
		return useChecklistCopyDialogValidation;
	}
};
</script>

<style scoped>
</style>
