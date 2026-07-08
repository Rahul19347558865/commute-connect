import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

interface ContributionSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watchContributionType: string;
  disabled?: boolean;
}

/**
 * ContributionSection - Dropdown and inputs managing co-travel contribution structures.
 * Shows amount fields only if the contribution type is set to paid.
 */
export const ContributionSection: React.FC<ContributionSectionProps> = ({
  register,
  errors,
  watchContributionType,
  disabled = false,
}) => {
  const showAmount = watchContributionType === 'paid';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Select
        label="Contribution Policy"
        error={errors.contribution_type?.message as string}
        disabled={disabled}
        {...register('contribution_type')}
      >
        <option value="free">Free (Complimentary Pool)</option>
        <option value="co-travel">Co-Travel (Split fuel costs equally)</option>
        <option value="paid">Paid (Set passenger contribution)</option>
      </Select>

      {showAmount && (
        <Input
          label="Passenger Contribution Amount (₹)"
          type="number"
          placeholder="e.g. 50"
          error={errors.contribution_amount?.message as string}
          disabled={disabled}
          {...register('contribution_amount', { valueAsNumber: true })}
        />
      )}
    </div>
  );
};
export default ContributionSection;
