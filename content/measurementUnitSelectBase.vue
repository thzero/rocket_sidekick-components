<script>
import { computed, onMounted, watch } from 'vue';

import AppCommonConstants from 'rocket_sidekick_common/constants';

import LibraryClientUtility from '@thzero/library_client/utility/index';

import { useBaseControlEditComponent } from '@thzero/library_client_vue3/components/baseControlEdit';
import { useContentBaseComponent } from '@/components/content/contentBase';

export function useMeasurementUnitSelectBaseComponent(props, context, options) {
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
		serviceStore,
		sortByOrder,
		target
	} = useContentBaseComponent(props, context, options);

	const {
		successResponse,
		isSaving,
		serverErrors,
		setErrors,
		convertValue,
		errorI,
		errorsI,
		innerValue,
		initValue,
		innerValueUpdate
	} = useBaseControlEditComponent(props, context, options);

	let initialized = false;

	const measurementUnits = computed(() => {
		if (String.isNullOrEmpty(props.measurementUnitsType))
			return [];
		if (props.measurementUnitsId === AppCommonConstants.MeasurementUnits.english.id)
			return measurementUnitTrans(AppCommonConstants.MeasurementUnits.english[props.measurementUnitsType], 'english', props.measurementUnitsType);
		if (props.measurementUnitsId === AppCommonConstants.MeasurementUnits.metrics.id)
			return measurementUnitTrans(AppCommonConstants.MeasurementUnits.metrics[props.measurementUnitsType], 'metrics', props.measurementUnitsType);
		return [];
	});

	const keyword = 'Default'.toLowerCase(); // otherwise gives a '_sfc_main is not defined' error as Vite is looking for lower case version of the keyword

	const measurementUnitTrans = (object, key, subKey) => {
		return object ? Object.getOwnPropertyNames(object).filter(l => l !== keyword).map((item) => { return { id: item, name: LibraryClientUtility.$trans.t('measurementUnits.' + key + '.' + subKey + '.' + item + 'Abbr') }; }) : {};
	};

	onMounted(async () => {
		setTimeout(() => {
			initialized = true;
		}, 50);
	});

	watch(() => props.measurementUnitsId,
		(value) => {
			if (!initialized)
				return;
			innerValue.value = null;
		}
	);

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
		serviceStore,
		sortByOrder,
		target,
		successResponse,
		isSaving,
		serverErrors,
		setErrors,
		convertValue,
		errorI,
		errorsI,
		innerValue,
		innerValueUpdate,
		initValue,
		measurementUnits,
		measurementUnitTrans
	};
};
</script>
