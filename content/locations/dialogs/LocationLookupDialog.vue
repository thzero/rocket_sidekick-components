<template>
	<VtFormListingDialog
		ref="dialogLocationLookup"
		:label="$t('titles.content.locations.title')"
		:signal="signal"
		:button-ok-disabled-override="buttonOkDisabledOverride"
		:pre-complete-ok="preCompleteOk"
		:reset-additional="resetAdditional"
		:reset-on-submit="false"
		:validation="validation"
		width="70vh"
		max-width="90vh"
		@close="close"
	>
		<template #default="{ buttonOkDisabled, isLoading }">
			<v-row dense>
				<v-col cols="12">
					<v-card>
						<v-card-text>
							<v-row dense>
								<v-col cols="12" sm="6">
									<VtTextFieldWithValidation
										ref="filterItemNameRef"
										v-model="filterItemName"
										vid="filterItemName"
										:validation="validation"
										:label="$t('forms.name')"
										:maxcount="30"
									/>
								</v-col>
							</v-row>
							<v-row dense>
								<v-col cols="12" sm="6">
									<VtSelectWithValidation
										ref="filterItemRocketTypesRef"
										v-model="filterItemRocketTypes"
										vid="filterItemRocketTypes"
										multiple
										:max-values="2"
										:items="rocketTypes"
										:validation="validation"
										:label="$t('forms.content.rockets.level')"
										:hint="$t('forms.content.rockets.level')"
									/>
								</v-col>
								<v-col cols="12" sm="6">
									<VtSelectWithValidation
										ref="filterItemOrganizationsRef"
										v-model="filterItemOrganizations"
										vid="filterItemOrganizations"
										multiple
										:max-values="5"
										:items="organizations"
										:validation="validation"
										:label="$t('forms.content.organizations.plural')"
									/>
								</v-col>
							</v-row>
						</v-card-text>
						<v-card-actions>
							<v-spacer />
							<v-btn
								:variant="buttonsForms.variant.clear"
								:color="buttonsForms.color.clear"
								:loading="isLoading"
								@click="clickLocationSearchClear"
							>{{ $t('buttons.clear') }}</v-btn>
							<v-btn
								:variant="buttonsForms.variant.ok"
								:color="buttonsForms.color.ok"
								:disabled="buttonOkDisabled"
								:loading="isLoading"
								@click="clickLocationSearch"
							>{{ $t('buttons.search') }}</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</template>
		<template v-slot:listing>
			<div
				v-if="!results"
				style="height: 35vh"
			>
				&nbsp;
			</div>
			<div
				v-if="results"
				class="row"
				style="height: 35vh"
			>
				<div
					v-for="item of results"
					:key="item.id"
				>
					<v-card>
						<v-card-title
							class="bg-primary"
						>
							{{ item.name }}
						</v-card-title>
						<v-card-text>
							<VtMarkdown v-model="item.description" :use-github=false />
							<!-- <div
								v-for="item2 of item.iterations"
								:key="item2.id"
							>
							{{  item2 }}
							</div> -->
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								:variant="buttonsForms.variant.default"
								:color="buttonsForms.color.default"
								@click="clickLocationSelect(item)"
							>
								{{ $t('buttons.select') }}
							</v-btn>
						</v-card-actions>
					</v-card>
				</div>
			</div>
		</template>
	</VtFormListingDialog>
	<VtConfirmationDialog
		:message="dialogResetMessage"
		:messageRaw=true
		:signal="dialogResetManager.signal"
		@cancel="dialogResetManager.cancel()"
		@ok="dialogResetOk"
	/>
	<VtConfirmationDialog
		ref="dialogSelectLocationConfirmRef"
		:message="dialogSelectLocationConfirmMessage"
		:messageRaw=true
		:signal="dialogSelectLocationConfirmManager.signal"
		@cancel="dialogSelectLocationConfirmCancel"
		@error="dialogSelectLocationConfirmError"
		@ok="dialogSelectLocationConfirmOk"
	/>
</template>

<script>
import LibraryCommonUtility from '@thzero/library_common/utility/index';

import { useLocationLookupDialogComponent } from '@/components/content/locations/dialogs/locationLookupDialogComponent';
import { useLocationLookupDialogComponentProps } from '@/components/content/locations/dialogs/locationLookupDialogComponentProps';
import { useLocationLookupDialogValidation } from '@/components/content/locations/dialogs/locationLookupDialogValidation';
import { useLookupDialogProps } from '@/components/content/dialogs/lookupDialogProps';

import MeasurementUnitSelect from '@/components/content/MeasurementUnitSelect';
import MeasurementUnitSelect2 from '@/components/content/MeasurementUnitSelect2';
import MeasurementUnitsSelect from '@/components/content/MeasurementUnitsSelect';
import VtConfirmationDialog from '@thzero/library_client_vue3_vuetify3/components/VtConfirmationDialog';
import VtFormListingDialog from '@thzero/library_client_vue3_vuetify3/components/form/VtFormListingDialog';
import VtMarkdown from '@thzero/library_client_vue3_vuetify3/components/markup/VtMarkdown';
import VtNumberFieldWithValidation from '@thzero/library_client_vue3_vuetify3/components/form/VtNumberFieldWithValidation';
import VtSelectWithValidation from '@thzero/library_client_vue3_vuetify3/components/form/VtSelectWithValidation';
import VtTextFieldWithValidation from '@thzero/library_client_vue3_vuetify3/components/form/VtTextFieldWithValidation';

export default {
	name: 'LocationLookupDialog',
	components: {
		MeasurementUnitSelect,
		MeasurementUnitSelect2,
		MeasurementUnitsSelect,
		VtConfirmationDialog,
		VtFormListingDialog,
		VtMarkdown,
		VtNumberFieldWithValidation,
		VtSelectWithValidation,
		VtTextFieldWithValidation
	},
	props: {
		...useLookupDialogProps,
		...useLocationLookupDialogComponentProps
	},
	emits: ['close', 'ok', 'select'],
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
			measurementUnitsLengthDefaultId,
			measurementUnitsLengthType,
			measurementUnitsFromUnitId,
			buttonsDialog,
			buttonsForms,
			measurementUnitsIdOutput,
			measurementUnitsIdSettings,
			organizations,
			rocketTypes,
			serviceStore,
			dialogSelectLocationConfirmManager,
			dialogSelectLocationConfirmMessage,
			dialogSelectLocationConfirmParams,
			filterItemCity,
			filterItemName,
			filterItemOrganizations,
			filterItemPostalCode,
			filterItemRocketTypes,
			dialogLocationLookup,
			dialogResetManager,
			dialogResetMessage,
			results,
			buttonOkDisabledOverride,
			clickLocationSearch,
			clickLocationSearchClear,
			clickLocationSelect,
			close,
			dialogResetOk,
			dialogSelectLocationConfirmCancel,
			dialogSelectLocationConfirmError,
			dialogSelectLocationConfirmOk,
			preCompleteOk,
			resetAdditional,
			scope,
			validation
		} = useLocationLookupDialogComponent(props, context);

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
			measurementUnitsLengthDefaultId,
			measurementUnitsLengthType,
			measurementUnitsFromUnitId,
			buttonsDialog,
			buttonsForms,
			measurementUnitsIdOutput,
			measurementUnitsIdSettings,
			organizations,
			rocketTypes,
			serviceStore,
			dialogSelectLocationConfirmManager,
			dialogSelectLocationConfirmMessage,
			dialogSelectLocationConfirmParams,
			filterItemCity,
			filterItemName,
			filterItemOrganizations,
			filterItemPostalCode,
			filterItemRocketTypes,
			dialogLocationLookup,
			dialogResetManager,
			dialogResetMessage,
			results,
			buttonOkDisabledOverride,
			clickLocationSearch,
			clickLocationSearchClear,
			clickLocationSelect,
			close,
			dialogResetOk,
			dialogSelectLocationConfirmCancel,
			dialogSelectLocationConfirmError,
			dialogSelectLocationConfirmOk,
			preCompleteOk,
			resetAdditional,
			scope,
			validation
		};
	},
	validations () {
		return Object.assign(LibraryCommonUtility.cloneDeep(LibraryCommonUtility.cloneDeep(useLocationLookupDialogValidation)));
	}
};
</script>

<style scoped>
</style>
