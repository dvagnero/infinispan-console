import React, { useState, useEffect } from 'react';
import {
    Divider,
    Form,
    FormGroup,
    NumberInput,
    Radio,
    Stack,
    Select,
    SelectOption,
    SelectVariant,
    Switch,
    Text,
    TextContent,
    TextVariants,
} from '@patternfly/react-core';
import { CacheType, EncodingType, CacheMode } from "@services/infinispanRefData";
import { useTranslation } from 'react-i18next';
import { MoreInfoTooltip } from '@app/Common/MoreInfoTooltip';

const ConfigurationBasic = (props:
    {
        basicConfiguration: BasicConfigurationStep,
        basicConfigurationModifier: (BasicConfigurationStep) => void
    }) => {

    const { t } = useTranslation();
    const brandname = t('brandname.brandname');

    // State for the form
    // Passed to the parent component
    const [topology, setTopology] = useState<string>(props.basicConfiguration.topology);
    const [mode, setMode] = useState<string>(props.basicConfiguration.mode);
    const [selectedNumberOwners, setSelectedNumberOwners] = useState(props.basicConfiguration.numberOfOwners);
    const [selectedEncodingCache, setSelectedEncodingCache] = useState(props.basicConfiguration.encoding);
    const [isStatistics, setIsStatistics] = useState(props.basicConfiguration.statistics);

    // Helper State
    const [isOpenEncodingCache, setIsOpenEncodingCache] = useState(false);

    useEffect(() => {
        // Update the form when the state changes
        props.basicConfigurationModifier({
            topology: topology,
            mode: mode,
            numberOfOwners: selectedNumberOwners,
            encoding: selectedEncodingCache,
            statistics: isStatistics
        });

    }, [topology, mode, selectedNumberOwners, selectedEncodingCache, isStatistics]);


    // Helper function for Number Owners Selection
    const minValue = 1;
    const maxValue = 10;

    const onMinus = () => {
        setSelectedNumberOwners(selectedNumberOwners - 1);
    };

    const onChange = event => {
        const newValue = isNaN(event.target.value) ? 0 : Number(event.target.value);
        setSelectedNumberOwners(newValue > maxValue ? maxValue : newValue < minValue ? minValue : newValue);
    };

    const onPlus = () => {
        setSelectedNumberOwners(selectedNumberOwners + 1);
    };

    // Helper function for Encoding Cache Selection
    const onToggleEncodingCache = () => {
        setIsOpenEncodingCache(!isOpenEncodingCache);
    };

    const onSelectEncodingCache = (event, selection, isPlaceholder) => {
        setSelectedEncodingCache(selection);
        setIsOpenEncodingCache(false);
    };

    // Form Topology
    const formTopology = () => {
        return (
            <React.Fragment>
                <Stack hasGutter>
                    <MoreInfoTooltip label={t('caches.create.configurations.basic.mode-title')} toolTip={t('caches.create.configurations.basic.mode-tooltip')} textComponent={TextVariants.h2} />
                    <FormGroup
                        isInline
                        isRequired
                        fieldId="topology"
                    >
                        <Radio
                            name="topology-radio"
                            id="distributed"
                            onChange={() => setTopology(CacheType.Distributed)}
                            isChecked={topology as CacheType == CacheType.Distributed}
                            label={
                                <TextContent>
                                    <Text component={TextVariants.h3}>
                                        {t('caches.create.configurations.basic.mode-distributed')}
                                    </Text>
                                </TextContent>
                            }
                        />
                        <Radio
                            name="topology-radio"
                            id="replicated"
                            onChange={() => setTopology(CacheType.Replicated)}
                            isChecked={topology as CacheType == CacheType.Replicated}
                            label={
                                <TextContent>
                                    <Text component={TextVariants.h3}>{t('caches.create.configurations.basic.mode-replicated')}</Text>
                                </TextContent>
                            }
                        />
                    </FormGroup>
                </Stack>

                <Stack hasGutter>
                    <MoreInfoTooltip label={t('caches.create.configurations.basic.cluster-repl-title')} toolTip={t('caches.create.configurations.basic.cluster-repl-tooltip')} textComponent={TextVariants.h2} />
                    <FormGroup
                        isInline
                        isRequired
                        fieldId="mode"
                    >
                        <Radio
                            name="mode-radio"
                            id="async"
                            onChange={() => setMode(() => CacheMode.ASYNC)}
                            isChecked={mode as CacheMode == CacheMode.ASYNC}
                            label={
                                <TextContent>
                                    <Text component={TextVariants.h3}>{t('caches.create.configurations.basic.cluster-repl-async')}</Text>
                                </TextContent>
                            }
                        />
                        <Radio
                            name="mode-radio"
                            id="sync"
                            onChange={() => setMode(() => CacheMode.SYNC)}
                            isChecked={mode as CacheMode == CacheMode.SYNC}
                            label={
                                <TextContent>
                                    <Text component={TextVariants.h3}>{t('caches.create.configurations.basic.cluster-repl-sync')}</Text>
                                </TextContent>
                            }
                        />
                    </FormGroup>
                </Stack>
            </React.Fragment>
        );
    };

    // Form Number of Owners
    const formNumberOwners = () => {
        return (
            <FormGroup
                fieldId='field-number-owners'
                isRequired={topology as CacheType == CacheType.Distributed}> {/*Required when topology is distributed */}
                <MoreInfoTooltip label={t('caches.create.configurations.basic.number-owners')} toolTip={t('caches.create.configurations.basic.number-owners-tooltip')} textComponent={TextVariants.h2} />
                <NumberInput
                    value={selectedNumberOwners}
                    min={minValue}
                    max={maxValue}
                    onMinus={onMinus}
                    onChange={onChange}
                    onPlus={onPlus}
                    inputName="input"
                    inputAriaLabel="number input"
                    minusBtnAriaLabel="minus"
                    plusBtnAriaLabel="plus"
                    widthChars={2}
                />
            </FormGroup>
        )
    }

    // Options for Encoding Cache
    const encodingTypeOptions = () => {
        const a = Object.keys(EncodingType).map((key) => (
            <SelectOption key={key} value={EncodingType[key]} />
        ));
        a.pop(); // Removing 'Empty' option
        return a;

    };

    // Form Encoding Cache
    const formEncodingCache = () => {
        return (
            <React.Fragment>
                <FormGroup
                    isInline
                    isRequired
                    fieldId="field-statistics"
                >
                    <Switch
                        aria-label="statistics"
                        id="statistics"
                        isChecked={isStatistics}
                        onChange={() => setIsStatistics(!isStatistics)}
                        isReversed
                    />
                    <MoreInfoTooltip label={t('caches.create.configurations.basic.statistics-title')} toolTip={t('caches.create.configurations.basic.statistics-tooltip')} textComponent={TextVariants.h2} />
                </FormGroup>
                <FormGroup
                    isInline
                    isRequired
                    fieldId="field-encoding-cache"
                >
                    <MoreInfoTooltip label={t('caches.create.configurations.basic.encoding-cache-title')} toolTip={t('caches.create.configurations.basic.encoding-cache-tooltip')} textComponent={TextVariants.h2} />
                    <Select
                        variant={SelectVariant.single}
                        aria-label={t('caches.create.configurations.basic.encoding-select-label')}
                        onToggle={onToggleEncodingCache}
                        onSelect={onSelectEncodingCache}
                        selections={selectedEncodingCache}
                        isOpen={isOpenEncodingCache}
                        aria-labelledby="toggle-id-number-owners"
                    >
                        {encodingTypeOptions()}
                    </Select>
                </FormGroup>
            </React.Fragment>
        )
    }

    return (
        <Form>

            {formTopology()}

            {/* Display the number of owners of the cache when the topology is distributed. */}
            {topology as CacheType == CacheType.Distributed && formNumberOwners()}

            <Divider />

            {formEncodingCache()}
        </Form>
    );
};

export default ConfigurationBasic;
