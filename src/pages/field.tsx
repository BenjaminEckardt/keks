import * as React from 'react';

interface FieldDeclaration {
    key: string;
    label: string;
    type: string;
}

const FIELD_TYPE_TO_VALUE_ACCESSOR = {
    text: 'value',
    number: 'value',
    checkbox: 'checked'
};

const identity = value => value;

const NaNToNullIntegerParser = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
};

const PARSERS = {
    text: identity,
    number: NaNToNullIntegerParser,
    checkbox: identity,
};

const undefinedOrNullToEmptyString = (value) => {
    return value === null || value === undefined ? '' : value;
};

const RENDERERS = {
    text: undefinedOrNullToEmptyString,
    number: undefinedOrNullToEmptyString,
    checkbox: identity,
};

const getTargetValue = (event: React.ChangeEvent<HTMLInputElement>, fieldType: string) => {
    const valueAccessor = FIELD_TYPE_TO_VALUE_ACCESSOR[fieldType];
    const unparsedValue = event.target[valueAccessor];
    const parser = PARSERS[fieldType];
    return parser(unparsedValue);
};

const renderValue = (fieldType: string, value) => {
    const renderer = RENDERERS[fieldType];
    return renderer(value);
};

interface FieldProps {
    id: string;
    type: string;
    value: any;
    label: string;
    prefix: string;
    onChange: (model: any) => void;
}

const Field: React.StatelessComponent<FieldProps> = (props) => {
    return (
        <div className="field">
            <label htmlFor={`${props.prefix}-${props.id}`}>{props.label}</label>
            <input
                id={`${props.prefix}-${props.id}`}
                type={props.type}
                value={renderValue(props.type, props.value)}
                onChange={(event) => props.onChange(getTargetValue(event, props.type))}
                className={`input-${props.type}`}
            />
        </div>
    );
};

export {Field, FieldDeclaration, getTargetValue, renderValue};