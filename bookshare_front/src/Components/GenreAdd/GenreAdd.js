import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Alert, Col, Row, Spinner} from "react-bootstrap";
import './GenreAdd.css';
import {makeAddGenreRequest} from "../../Requests/moks/AddGenreRequest";
import Cookies from "js-cookie";


class GenreAddNoTr extends React.Component {

    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            genreCode: '',
            fields: [],
            errors: {keys: [], values: []},
            button: 'Form.CreateGenreButton',
            response: '',
            errorCode: '',
            requestFailed: false
        };
    }

    handleSubmit(event) {
        event.preventDefault();
        const errors = this.checkForErrors();
        this.setState(
            {
                errors: errors
            }
        );
        let shouldAbort = false;
        if(errors.genreCode !== undefined){
            return;
        }
        errors.keys.forEach((value => {
            if(value !== ''){
                shouldAbort = true;
            }
        }))
        errors.values.forEach((value => {
            if(value !== ''){
                shouldAbort = true;
            }
        }))
        if(shouldAbort){
            return;
        }


        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeAddGenreRequest(token, this.state.genreCode, this.state.fields, this);
    }

    addKeyValuePair() {
        let fields = [...this.state.fields];
        let pair = {
            key: '',
            value: ''
        }
        fields.push(pair);
        this.setState({
            fields: fields
        });
    }

    removeKeyValue() {
        let fields = [...this.state.fields];
        const errors = this.state.errors;
        errors.values.pop();
        errors.keys.pop();
        fields.pop();
        this.setState({
            fields: fields,
            errors: errors
        });
    }

    checkForErrors() {

        const errors = {keys: [], values: []};
        const keys = [];

        if(this.state.fields.length < 1){
            errors.genreCode = "Form.CannotCreateGenreWIthoutTranslationError";
        }
        if (this.state.genreCode.length < 1) {
            errors.genreCode = "Form.EmptyFieldError";
        }

        this.state.fields.forEach((field, index) => {
            errors.keys.push('');
            errors.values.push('');
            if (field.key.length < 2) {
                errors.keys[index] = 'Form.KeyTooShortError';
            }
            if (field.key.length < 1) {
                errors.keys[index] = 'Form.EmptyFieldError';
            }
            if (field.key.length > 0 && keys.includes(field.key)) {
                errors.keys[index] = 'Form.KeysNotUnique';
            }
            keys.push(field.key);
            if (field.value.length < 1) {
                errors.values[index] = 'Form.EmptyFieldError';
            }
        })

        return errors;
    };

    renderKeyValues() {
        return this.state.fields.map((value, index) => this.renderKeyValue(value, index))
    }

    renderKeyValue(pair, index) {
        const  {t} = this.props;
        return (
            <Row>
                <Col>
                    <Form.Label>{t('Genre.key')}</Form.Label>
                    <Form.Control
                        className={'d-inline w-20 m-1'}
                        autoFocus
                        size={"sm"}
                        type="text"
                        value={this.state.fields[index].key}
                        onChange={(e) => {
                            let fields = [...this.state.fields];
                            let pair = {...fields[index]}
                            pair.key = e.target.value.toString().toUpperCase().substring(0, 2);
                            fields[index] = pair;
                            this.setState({
                                fields: fields
                            });
                        }}
                        isInvalid={!!this.state.errors.keys[index]}
                    />
                    <Form.Control.Feedback type="invalid">
                        {t(this.state.errors.keys[index])}
                    </Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label>{t('Genre.value')}</Form.Label>
                    <Form.Control
                        className={'d-inline w-20 m-1'}
                        autoFocus
                        size={"sm"}
                        type="text"
                        value={this.state.fields[index].value}
                        onChange={(e) => {
                            let fields = [...this.state.fields];
                            let pair = {...fields[index]}
                            pair.value = e.target.value;
                            fields[index] = pair;
                            this.setState({
                                fields: fields
                            });
                        }}
                        isInvalid={!!this.state.errors.values[index]}
                    />
                    <Form.Control.Feedback type="invalid">
                        {t(this.state.errors.values[index])}
                    </Form.Control.Feedback>
                </Col>
            </Row>
        )
    }

    render() {
        const {t} = this.props
        return (
            <Fragment>
                <Alert variant='danger' show={this.state.requestFailed}>
                    {this.state.errorCode}
                    <br/>
                    {t(this.state.response)}
                </Alert>
                <div className="GenreAdd">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Form.Group size="lg" controlId="genreCode">
                            <Form.Label>{t('Genre.code')}</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={this.state.genreCode}
                                onChange={(e) => {
                                    this.setState({
                                        genreCode: e.target.value
                                    });
                                }}
                                isInvalid={!!this.state.errors.genreCode}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t(this.state.errors.genreCode)}
                            </Form.Control.Feedback>
                            <Button variant='outline-dark' size="sm" type="button" className='m-3 d-inline'
                                    disabled={false}
                                    onClick={this.addKeyValuePair.bind(this)}>
                                +
                            </Button>
                            <Button variant='outline-dark' size="sm" type="button" className='m-3 d-inline'
                                    disabled={this.state.fields.length < 1}
                                    onClick={this.removeKeyValue.bind(this)}>
                                -
                            </Button>
                        </Form.Group>
                        <Form.Group size="lg" controlId="genreCode">
                            {this.renderKeyValues()}

                            <Form.Control.Feedback type="invalid">
                                {t(this.state.errors.genreCode)}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                            {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                        </Button>
                    </Form>
                </div>

            </Fragment>
        )
    }
}


const GenreAddTr = withTranslation()(GenreAddNoTr)
export default function GenreAdd() {
    return (
        <GenreAddTr/>
    )
}