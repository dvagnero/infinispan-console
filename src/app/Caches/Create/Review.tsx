import React from 'react';
import { Flex, Form, FormGroup, Text, TextArea, TextContent, TextVariants } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { CacheConfigUtils } from "@services/cacheConfigUtils";

const Review = (props:
    {
        cacheName: string,
        cacheConfiguration: CacheConfiguration
    }) => {

    const { t } = useTranslation();

    const displayCacheConfigEditor = () => {
        return (
            <FormGroup
                fieldId="cache-config"
            >
                <TextArea
                    isRequired
                    value={CacheConfigUtils.createCacheConfigFromData(props.cacheConfiguration)}
                    name="cache-config"
                    id="cache-config"
                    rows={20}
                />
            </FormGroup>
        );
    };

    return (
        <Form>
            <TextContent>
                <Text component={TextVariants.h1}>{t('caches.create.review.review-title')}</Text>
                <TextContent>
                    <Text component={TextVariants.p}>{t('caches.create.review.review-subtitle')}</Text>
                </TextContent>
                <Flex>
                    <Text component={TextVariants.p}>{t('caches.create.review.review-cache-name')}</Text>
                    <Text component={TextVariants.h4}>{props.cacheName}</Text>
                </Flex>
            </TextContent>

            {displayCacheConfigEditor()}
        </Form>
    );
};

export default Review;
