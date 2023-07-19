import { between, decimal, maxLength, minLength, required } from '@vuelidate/validators';

export const useParachutePartsListingFilterValidation = {
	detailItemCd: { decimal, between: between(0, 9), $autoDirty: true },
	detailItemDiameter: { decimal, between: between(0, 2004), $autoDirty: true },
	detailItemLoadMax: { decimal, between: between(0, 2004), $autoDirty: true },
	detailItemLoadMin: { decimal, between: between(0, 2004), $autoDirty: true },
	detailItemThinMill: { $autoDirty: true },
	diameterMeasurementUnitId: { $autoDirty: true },
	diameterMeasurementUnitsId: { $autoDirty: true }
};