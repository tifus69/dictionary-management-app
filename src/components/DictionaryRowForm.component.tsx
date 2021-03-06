import React, { useState } from 'react';
import { Col, FormGroup, Input, Label, Button, Form } from 'reactstrap';
import { MdDeleteForever, MdSave, MdEdit } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import validator from 'validator';

import {
  DELETE_DICTIONARY_ROW,
  UPDATE_DICTIONARY_ROW,
  Dictionary,
} from '../actions/types/dictionaries.action.type';
import { IconWarning, ColWarning } from '../styled/style';
import { notify } from '../utils';
import { Row } from '../actions/types/rows.action.type';

interface DictionaryRowFormProps {
  dictionary: Dictionary;
  row: Row;
}

const DictionaryRowForm = ({ dictionary, row }: DictionaryRowFormProps) => {
  const [errorDomain, setErrorDomain] = useState(false);
  const [errorRange, setErrorRange] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [updatedRow, setRow] = useState({ id: 0, domain: '', range: '' });

  const dispatch = useDispatch();

  const handleRowValidation = () => {
    let cycle, duplicate;
    let hasDuplicate = { hasDuplicate: false };
    validator.trim(updatedRow.domain);
    validator.trim(updatedRow.range);
    if (
      validator.isEmpty(updatedRow.domain, { ignore_whitespace: true }) ||
      validator.isEmpty(updatedRow.range, { ignore_whitespace: true })
    ) {
      setErrorDomain(validator.isEmpty(updatedRow.domain, { ignore_whitespace: true }));
      return setErrorRange(
        validator.isEmpty(updatedRow.range, { ignore_whitespace: true })
      );
    }
    cycle = dictionary.rows.filter(
      row => row.range === updatedRow.domain && row.id !== updatedRow.id
    );
    duplicate = dictionary.rows.filter(
      row => row.domain === updatedRow.domain && row.id !== updatedRow.id
    );
    if (cycle.length) {
      notify('error', 'Chain or cycle !');
      return setErrorDomain(true);
    }
    if (duplicate.length) {
      hasDuplicate = { hasDuplicate: true };
      notify('warning', 'Duplicate domain !');
    }
    let row = { ...updatedRow, ...hasDuplicate };
    return handleSaveRow(row);
  };

  const handleDeleteRow = (row: Row) => {
    let payload;
    const duplicate = dictionary.rows.filter(
      elt => elt.domain === row.domain && elt.hasDuplicate
    );
    if (duplicate.length) {
      payload = {
        dictionaryId: dictionary.id,
        row: {
          ...duplicate[0],
          hasDuplicate: false,
        },
      };
      dispatch({ payload, type: UPDATE_DICTIONARY_ROW });
    }
    payload = { dictionaryId: dictionary.id, rowId: row.id };
    dispatch({ payload, type: DELETE_DICTIONARY_ROW });
    notify('success', 'Row removed !');
  };

  const handleEditRow = (row: Row) => {
    setActiveId(row.id);
    setRow({ ...row });
  };

  const handleSaveRow = (row: Row) => {
    let payload;
    payload = { dictionaryId: dictionary.id, row };
    dispatch({ payload, type: UPDATE_DICTIONARY_ROW });
    setActiveId(null);
    notify('success', 'Row updated !');
  };

  return (
    <Form>
      <FormGroup row>
        <Label for="domain" sm={1}>
          Domain
        </Label>
        <Col sm={3}>
          <Input
            onFocus={() => {
              setErrorDomain(false);
            }}
            invalid={errorDomain}
            disabled={row.id !== activeId}
            type="text"
            name="domain"
            defaultValue={row.domain}
            onChange={e => setRow({ ...updatedRow, domain: e.target.value, id: row.id })}
          />
        </Col>
        <Label for="range" sm={1}>
          Range
        </Label>
        <Col sm={3}>
          <Input
            onFocus={() => setErrorRange(false)}
            invalid={errorRange}
            type="text"
            disabled={row.id !== activeId}
            name="range"
            defaultValue={row.range}
            onChange={e => setRow({ ...updatedRow, range: e.target.value, id: row.id })}
          />
        </Col>
        <ColWarning>{row.hasDuplicate && <IconWarning />}</ColWarning>
        <Col sm={{ size: 1, offset: 1 }}>
          <Button
            className="mr-sm-2"
            outline
            onClick={() => handleDeleteRow(row)}
            color="danger"
          >
            <MdDeleteForever />
          </Button>
        </Col>
        {row.id === activeId ? (
          <Col sm={1}>
            <Button className="mr-sm-2" outline onClick={() => handleRowValidation()}>
              <MdSave />
            </Button>
          </Col>
        ) : (
          <Col sm={1}>
            <Button className="mr-sm-2" outline onClick={() => handleEditRow(row)}>
              <MdEdit />
            </Button>
          </Col>
        )}
      </FormGroup>
    </Form>
  );
};

export default DictionaryRowForm;
