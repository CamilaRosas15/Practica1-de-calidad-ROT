"use client";

import { Select, SelectItem } from "@heroui/react";

type CountryFilterProps = {
  readonly onCountriesChange: (countries: string[]) => void;
  readonly selectedCountries: string[];
  readonly availableCountries: string[];
};

export function CountryFilter({ onCountriesChange, selectedCountries, availableCountries }: CountryFilterProps) {
  return (
    <Select
      disallowEmptySelection
      isMultiline
      className="w-full"
      items={availableCountries.map((name) => ({ name }))}
      label="Filter by countries"
      placeholder="Select countries"
      selectedKeys={selectedCountries}
      selectionMode="multiple"
      onSelectionChange={(keys) => onCountriesChange(Array.from(keys) as string[])}
    >
      {(country) => <SelectItem key={country.name}>{country.name}</SelectItem>}
    </Select>
  );
}
