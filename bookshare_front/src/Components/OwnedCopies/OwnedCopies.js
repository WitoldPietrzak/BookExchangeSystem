import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import './OwnedCopies.css'
import RefreshIcon from '../../Resources/refresh.png';
import {useParams} from "react-router-dom";
import {
    makeCreatedBookCopyListRequest,
    makeOwnedBookCopyListRequest,
    makeReservedBookCopyListRequest
} from "../../Requests/moks/BookCopyListRequest";

class OwnedCopiesNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.action = this.props.params.action;
        this.state = {
            copies: {},
            response: '',
            requestFailed: false,
            showDeleteSuccessModal: false,
            showModifyModal: false,
            showDeleteConfirm: false
        }
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        this.reloadUserInfo();

    }

    reloadUserInfo() {
        const {action} = this.props.params;
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        if(this.action==='owned'){
            makeOwnedBookCopyListRequest(token,this)
        }
        if(this.action==="reserved"){
            makeReservedBookCopyListRequest(token,this)
        }
        if(this.action==="created"){
            makeCreatedBookCopyListRequest(token,this)
        }
    }


    renderBookCopiesInfo() {
        const {t} = this.props;
        return (
            <div className="m-5 mb-3 BookshelfBookList">
                <Row className={'Title'}>
                    <Col>{t('Bookshelf.BookList')} </Col></Row>
                <Row className={'InfoHeader'}>
                    <Col>{t('Book.title')}</Col>
                    <Col>{t('Book.coverType')}</Col>
                    <Col>{t('Book.language')}</Col>
                </Row>
                {this.state.copies.map(book => this.renderBookCopyInfo(book))}
            </div>
        )
    }

    renderBookCopyInfo(row) {
        const {t} = this.props;
        return (
            <Row className={'BookshelfBookListRow'} onClick={() => {
                window.location.hash = `#/books/copies/${row.id}`;
                window.location.reload();
            }}>
                <Col>{t(row.title)}</Col>
                <Col>{t(row.cover)}</Col>
                <Col>{row.language}</Col>
                {/*{this.action='reserved'?<Col>{t(row.)}</Col>}*/}
            </Row>
        )

    }

    renderOptionBar() {
        const {t} = this.props;
        return (
            <div className={"OptionsPanel mb-5 me-5 "}>
                <Button className={'m-1 mt-0 mb-0 me-0'} variant={'outline-dark'} size={'sm'}
                        onClick={this.reloadUserInfo.bind(this)}>
                    <img alt={''} src={RefreshIcon} width={25} height={25}/>
                </Button>
            </div>)
    }

    render() {
        const {t} = this.props;
        return (
            <Fragment>
                <Row>
                    <Col>
                        <Alert show={this.state.requestFailed}
                               className={'m-3'}
                               variant={'danger'}>{t(this.state.response)}</Alert>
                        <div className={'d-grid gap-2 mt-4 mb-0 m-5'}>
                        </div>
                    </Col>

                </Row>
                {this.renderOptionBar()}
                <Row className={'mb-3'}>
                    <Col>
                        {this.state.copies.length > 0 ? this.renderBookCopiesInfo() : <div>{t('List.empty')}</div>}
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

const OwnedCopiesTr = withTranslation()(OwnedCopiesNoTr);


export default function OwnedCopies() {
    const params = useParams();

    return (
        <OwnedCopiesTr params={params}/>
    )


}