import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Row, Col } from 'reactstrap';
import { MdDeleteForever, MdEdit, MdRemoveRedEye } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import { DELETE_DICTIONARY, Dictionary } from '../actions/types/dictionaries.action.type';
import { notify } from '../utils';
import { IconWarning, ColWarning } from '../styled/style';

interface DictionaryRowProps {
  dictionary: Dictionary;
}

const DictionaryRow = ({ dictionary }: DictionaryRowProps) => {
  const hasDuplicate = dictionary.rows.filter(row => row.hasDuplicate);
  const dispatch = useDispatch();
  let history = useHistory();
  const handleRemove = (id: number) => {
    const payload = { id };
    dispatch({ payload, type: DELETE_DICTIONARY });
    notify('success', 'Dictionary deleted !');
  };
  return (
    <Row key={dictionary.id} className="mt-2">
      <Col xs="4">
        <h6>{dictionary.name}</h6>
      </Col>
      <Col xs="4">
        <h6>{dictionary.rows.length}</h6>
      </Col>
      <ColWarning xs="1">{hasDuplicate.length ? <IconWarning /> : null}</ColWarning>
      <Col xs={{ size: 1 }}>
        <Button
          onClick={() =>
            history.push({
              pathname: '/editDictionary',
              state: { id: dictionary.id },
            })
          }
          outline
        >
          <MdEdit />
        </Button>
      </Col>
      <Col xs="1">
        <Button
          onClick={() => history.push({ pathname: '/dictionary', state: { dictionary } })}
          outline
        >
          <MdRemoveRedEye />
        </Button>
      </Col>
      <Col xs="1">
        <Button color="danger" onClick={() => handleRemove(dictionary.id)} outline>
          <MdDeleteForever />
        </Button>
      </Col>
    </Row>
  );
};

export default DictionaryRow;
