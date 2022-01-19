import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class QuickSearchBookshelfNoTr extends React.Component {
    constructor(props) {
        super(props);
        const {t} = this.props;
        this.state = {
            bookshelf: '',
            errors: {},
            button: 'Form.FindBookshelfButton',
        }
    }

    handleSubmit(){

    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.Group size="lg" controlId="loginOrMail">
                        <Form.Label className="required">{t('Form.Bookshelf')}</Form.Label>
                        <Form.Control
                            autoFocus
                            type="text"
                            value={this.state.bookshelf}
                            onChange={(e) => {
                                this.setState({
                                    bookshelf: e.target.value
                                });
                            }}
                            isInvalid={!!this.state.errors.bookshelf}
                        />
                        <Form.Control.Feedback type="invalid">
                            {this.state.errors.login}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant='outline-dark' size="md" type="submit" className='m-3' disabled={false}>
                        {typeof this.state.button === "string" ? t(this.state.button) : this.state.button}
                    </Button>

                </Form>
            </Fragment>
        )
    }

}

const QuickSearchBookshelfTr = withTranslation()(QuickSearchBookshelfNoTr);

export default function QuickSearchBookshelf() {
    return (
        <QuickSearchBookshelfTr/>
    )
}