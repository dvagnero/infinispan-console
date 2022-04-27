import React, { useState, useEffect } from 'react';
import {
    Divider,
    ExpandableSection,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    Label,
    Text,
    TextContent,
    TextVariants,
    TextInput,
    Switch,
    Radio,
} from '@patternfly/react-core';
import { global_spacer_sm } from '@patternfly/react-tokens';
import { IndexedStorage } from "@services/infinispanRefData";
import { useTranslation } from 'react-i18next';
import { MoreInfoTooltip } from '@app/Common/MoreInfoTooltip';

const IndexedCache = (props: {
    indexedOptions: IndexedCache,
    indexedOptionsModifier: (IndexedCache) => void,
}) => {

    const { t } = useTranslation();
    const brandname = t('brandname.brandname');

    //Indexed Cache
    const [enableIndexing, setEnableIndexing] = useState<boolean>(props.indexedOptions.enableIndexing);
    const [indexedStorage, setIndexedStorage] = useState<'persistent' | 'volatile'>(props.indexedOptions.indexedStorage);
    const [indexedEntities, setIndexedEntities] = useState<string[]>(props.indexedOptions.indexedEntities);

    //Index Reader
    const [refreshInterval, setRefreshInterval] = useState<number>(props.indexedOptions.indexReader);

    //Index Writer
    const [commitInterval, setCommitInterval] = useState<number>(props.indexedOptions.indexWriter.commitInterval);
    const [lowLevelTrace, setLowLevelTrace] = useState<boolean>(props.indexedOptions.indexWriter.lowLevelTrace);
    const [maxBufferedEntries, setMaxBufferedEntries] = useState<number>(props.indexedOptions.indexWriter.maxBufferedEntries);
    const [queueCount, setQueueCount] = useState<number>(props.indexedOptions.indexWriter.queueCount);
    const [queueSize, setQueueSize] = useState<number>(props.indexedOptions.indexWriter.queueSize);
    const [ramBufferSize, setRamBufferSize] = useState<number>(props.indexedOptions.indexWriter.ramBufferSize);
    const [threadPoolSize, setThreadPoolSize] = useState<number>(props.indexedOptions.indexWriter.threadPoolSize);

    //Index Merge
    const [calibrateByDeletes, setCalibrateByDeletes] = useState<boolean>(props.indexedOptions.indexMerge.calibrateByDeletes);
    const [factor, setFactor] = useState<number>(props.indexedOptions.indexMerge.factor);
    const [maxEntries, setMaxEntries] = useState<number>(props.indexedOptions.indexMerge.maxEntries);
    const [minSize, setMinSize] = useState<number>(props.indexedOptions.indexMerge.minSize);
    const [maxSize, setMaxSize] = useState<number>(props.indexedOptions.indexMerge.maxSize);
    const [maxForcedSize, setMaxForcedSize] = useState<number>(props.indexedOptions.indexMerge.maxForcedSize);

    const [isOpenIndexReader, setIsOpenIndexReader] = useState(false);
    const [isOpenIndexWriter, setIsOpenIndexWriter] = useState(false);
    const [isOpenIndexMerge, setIsOpenIndexMerge] = useState(false);
    const [entityInput, setEntityInput] = useState<string>('');
    const [validEntity, setValidEntity] = useState<'success' | 'error' | 'default'>('default');

    useEffect(() => {
        props.indexedOptionsModifier({
            enableIndexing: enableIndexing,
            indexedStorage: indexedStorage,
            indexedEntities: indexedEntities,
            indexReader: refreshInterval,
            indexWriter: {
                commitInterval: commitInterval,
                lowLevelTrace: lowLevelTrace,
                maxBufferedEntries: maxBufferedEntries,
                queueCount: queueCount,
                queueSize: queueSize,
                ramBufferSize: ramBufferSize,
                threadPoolSize: threadPoolSize,
            },
            indexMerge: {
                calibrateByDeletes: calibrateByDeletes,
                factor: factor,
                maxEntries: maxEntries,
                minSize: minSize,
                maxSize: maxSize,
                maxForcedSize: maxForcedSize,
            },
        });
    }, [enableIndexing, indexedStorage, indexedEntities, refreshInterval, commitInterval, lowLevelTrace, maxBufferedEntries, queueCount, queueSize, ramBufferSize, threadPoolSize, calibrateByDeletes, factor, maxEntries, minSize, maxSize, maxForcedSize]);

    const deleteChip = (chipToDelete: string) => {
        const newChips = indexedEntities.filter(chip => !Object.is(chip, chipToDelete));
        setIndexedEntities(newChips);
    };

    const addChip = (newChipText: string) => {
        setIndexedEntities([...indexedEntities, `${newChipText}`]);
        setEntityInput('');
    };

    /** enable keyboard only usage while focused on the text input */
    const handleTextInputKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && entityInput.length) {
            if (!indexedEntities.includes(entityInput)) {
                addChip(entityInput);
                setValidEntity('success')
            }
            else {
                setValidEntity('error');
            }
        }
    };

    const formIndexEntities = () => {
        return (
            <FormGroup isInline fieldId='indexed-entities' validated={validEntity} helperTextInvalid="Entity should be unique">
                <MoreInfoTooltip label="Indexed Entities" toolTip="Indexed Entities Tooltip" textComponent={TextVariants.h3} />

                {indexedEntities.map(currentChip => (
                    <Label key={currentChip} onClose={() => deleteChip(currentChip)} color="blue">
                        {currentChip}
                    </Label>
                ))}

                <TextInput style={{ marginTop: global_spacer_sm.value }} value={entityInput} type="text" onChange={(val) => setEntityInput(val)} onKeyDown={handleTextInputKeyDown} />

            </FormGroup>
        )
    }

    const formIndexReader = () => {
        return (
            <FormGroup fieldId='index-reader'>
                <ExpandableSection
                    toggleText="Index Reader"
                    onToggle={() => setIsOpenIndexReader(!isOpenIndexReader)}
                    isExpanded={isOpenIndexReader}
                >
                    <MoreInfoTooltip label="Refresh Interval" toolTip="Refresh Interval Tooltip" textComponent={TextVariants.h3} />
                    <TextInput value={refreshInterval} type="number" onChange={(val) => setRefreshInterval(parseInt(val))} aria-label="refresh-interval" />
                </ExpandableSection>
            </FormGroup>
        )
    }

    const formIndexWriter = () => {
        return (
            <ExpandableSection
                toggleText="Index Writer"
                onToggle={() => setIsOpenIndexWriter(!isOpenIndexWriter)}
                isExpanded={isOpenIndexWriter}
            >
                <Form>
                    <FormGroup
                        isInline
                        fieldId='low-level-trace'
                    >
                        <Switch
                            aria-label="low-level-trace"
                            id="low-level-trace"
                            isChecked={lowLevelTrace}
                            onChange={() => setLowLevelTrace(!lowLevelTrace)}
                        />
                        <MoreInfoTooltip label="Low Level Trace" toolTip="Low Level Trace Tooltip" textComponent={TextVariants.h3} />
                    </FormGroup>

                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='commit-interval'
                            >
                                <MoreInfoTooltip label="Commit Interval" toolTip="Commit Interval Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={commitInterval} type="number" onChange={(val) => setCommitInterval(parseInt(val))} aria-label="commit-interval" />
                            </FormGroup>
                        </FlexItem>

                        <FlexItem>

                            <FormGroup
                                isInline
                                fieldId='max-buffered-entries'
                            >
                                <MoreInfoTooltip label="Max Buffered Entries" toolTip="Max Buffered Entries Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={maxBufferedEntries} type="number" onChange={(val) => setMaxBufferedEntries(parseInt(val))} aria-label="max-buffered-entries" />
                            </FormGroup>
                        </FlexItem>

                        <FlexItem>

                            <FormGroup
                                isInline
                                fieldId='queue-count'
                            >
                                <MoreInfoTooltip label="Queue Count" toolTip="Queue Count Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={queueCount} type="number" onChange={(val) => setQueueCount(parseInt(val))} aria-label="queue-count" />
                            </FormGroup>
                        </FlexItem>
                    </Flex>

                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='queue-size'
                            >
                                <MoreInfoTooltip label="Queue Size" toolTip="Queue Size Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={queueSize} type="number" onChange={(val) => setQueueSize(parseInt(val))} aria-label="queue-size" />
                            </FormGroup>
                        </FlexItem>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='ram-buffer-size'
                            >
                                <MoreInfoTooltip label="Ram Buffer Size" toolTip="Ram Buffer Size Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={ramBufferSize} type="number" onChange={(val) => setRamBufferSize(parseInt(val))} aria-label="ram-buffer-size" />
                            </FormGroup>
                        </FlexItem>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='thread-pool-size'
                            >
                                <MoreInfoTooltip label="Thread Pool Size" toolTip="Thread Pool Size Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={threadPoolSize} type="number" onChange={(val) => setThreadPoolSize(parseInt(val))} aria-label="thread-pool-size" />
                            </FormGroup>
                        </FlexItem>
                    </Flex>
                </Form>
            </ExpandableSection>
        )
    }

    const formIndexMerge = () => {
        return (
            <ExpandableSection
                toggleText="Index Merge"
                onToggle={() => setIsOpenIndexMerge(!isOpenIndexMerge)}
                isExpanded={isOpenIndexMerge}
            >
                <Form>
                    <FormGroup
                        isInline
                        fieldId='calibrate-by-deletes'
                    >
                        <Switch
                            aria-label="calibrate-by-deletes"
                            id="calibrate-by-deletes"
                            isChecked={calibrateByDeletes}
                            onChange={() => setCalibrateByDeletes(!calibrateByDeletes)}
                        />
                        <MoreInfoTooltip label="Calibrate By Deletes" toolTip="Calibrate By Deletes Tooltip" textComponent={TextVariants.h3} />
                    </FormGroup>

                    <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='factor'
                            >
                                <MoreInfoTooltip label="Factor" toolTip="Factor Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={factor} type="number" onChange={(val) => setFactor(parseInt(val))} aria-label="factor" />
                            </FormGroup>
                        </FlexItem>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='max-entries'
                            >
                                <MoreInfoTooltip label="Max Entries" toolTip="Max Entries Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={maxEntries} type="number" onChange={(val) => setMaxEntries(parseInt(val))} aria-label="max-entries" />
                            </FormGroup>
                        </FlexItem>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='min-size'
                            >
                                <MoreInfoTooltip label="Min Size" toolTip="Min Size Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={minSize} type="number" onChange={(val) => setMinSize(parseInt(val))} aria-label="min-size" />
                            </FormGroup>
                        </FlexItem>
                    </Flex>

                    <Flex>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='max-size'
                            >
                                <MoreInfoTooltip label="Max Size" toolTip="Max Size Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={maxSize} type="number" onChange={(val) => setMaxSize(parseInt(val))} aria-label="max-size" />
                            </FormGroup>
                        </FlexItem>
                        <FlexItem>
                            <FormGroup
                                isInline
                                fieldId='max-forced-size'
                            >
                                <MoreInfoTooltip label="Max Forced Size" toolTip="Max Forced Size Tooltip" textComponent={TextVariants.h3} />
                                <TextInput value={maxForcedSize} type="number" onChange={(val) => setMaxForcedSize(parseInt(val))} aria-label="max-forced-size" />
                            </FormGroup>
                        </FlexItem>
                    </Flex>
                </Form>
            </ExpandableSection>
        )
    }

    return (
        <Form>
            <Divider />
            <TextContent>
                <MoreInfoTooltip label="Indexed" toolTip="Indexed Tooltip" textComponent={TextVariants.h2} />
            </TextContent>

            <FormGroup
                fieldId='enable-indexing'
                isRequired
                isInline
            >
                <Switch
                    aria-label="enable"
                    id="enable-indexing"
                    isChecked={enableIndexing}
                    onChange={() => setEnableIndexing(!enableIndexing)}
                    isReversed
                />
                <MoreInfoTooltip label="Enable Indexing" toolTip="Enable indexing tooltip" textComponent={TextVariants.h3} />
            </FormGroup>

            <TextContent>
                <MoreInfoTooltip label="Storage" toolTip="Storage Tooltip" textComponent={TextVariants.h3} />
            </TextContent>

            <FormGroup
                fieldId='indexed-storage'
                isRequired
                isInline
            >
                <Radio
                    name="radio-storage"
                    id="persistent"
                    onChange={() => setIndexedStorage(IndexedStorage.persistent)}
                    isChecked={indexedStorage === IndexedStorage.persistent}
                    label={
                        <TextContent>
                            <Text component={TextVariants.h3}>Persistent</Text>
                        </TextContent>
                    }
                />
                <Radio
                    name="radio-storage"
                    id="volatile"
                    onChange={() => setIndexedStorage(IndexedStorage.volatile)}
                    isChecked={indexedStorage === IndexedStorage.volatile}
                    label={
                        <TextContent>
                            <Text component={TextVariants.h3}>Volatile</Text>
                        </TextContent>
                    }
                />
            </FormGroup>

            {formIndexEntities()}
            {formIndexReader()}
            {formIndexWriter()}
            {formIndexMerge()}
        </Form>
    );
};

export default IndexedCache;
