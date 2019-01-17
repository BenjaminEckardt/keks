import * as React from 'react';
import {Filter} from '../cookies';
import {Field, FieldDeclaration} from './field';
import update from 'immutability-helper';

interface Props {
    id: number;
    filter: Filter;
    onChange: (filter: Filter) => void;
}

const FIELDS: Array<FieldDeclaration> = [
    {key: 'url', label: 'URL', type: 'text'},
    {key: 'domain', label: 'Domain', type: 'text'},
    {key: 'name', label: 'Name', type: 'text'},
    {key: 'path', label: 'Path', type: 'text'},
    {key: 'secure', label: 'Secure', type: 'checkbox'},
];

const CookieFilter: React.StatelessComponent<Props> = (props) => (
    <div className="cookie-filter">
        {FIELDS.map((field, index) => (
            <Field
                id={'' + props.id}
                key={index}
                type={field.type}
                value={props.filter[field.key]}
                label={field.label}
                prefix={`filter-${field.key}`}
                onChange={(newValue) => props.onChange(update(props.filter, {[field.key]: {$set: newValue}}))}
            />
        ))}
    </div>
);

export {CookieFilter};