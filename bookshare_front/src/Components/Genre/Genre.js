import React, {Fragment} from "react";
import {withTranslation} from "react-i18next";
import Cookies from "js-cookie";
import {Accordion, Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import './Genre.css'
import RefreshIcon from '../../Resources/refresh.png';
import {useParams} from "react-router-dom";
import {makeGenreRequest} from "../../Requests/moks/GenreRequest";
import {makeDeleteGenreRequest} from "../../Requests/moks/DeleteGenreRequest";
import GenreModify from "../GenreModify/GenreModify";

class GenreNoTr extends React.Component {
    constructor(props) {
        super(props);
        this.tempLocation = {lng: 0, lat: 0}
        this.id = this.props.params.id;
        this.state = {
            genre: '',
            response: '',
            requestFailed: false,
            showDeleteSuccessModal: false,
            showModifyModal:false,
            showDeleteConfirm: false
        }
    }

    componentDidMount() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeGenreRequest(token, this.id, this);
    }

    reloadUserInfo() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeGenreRequest(token, this.id, this);
    }


    removeGenre() {
        const token = Cookies.get(process.env.REACT_APP_FRONT_JWT_TOKEN_COOKIE_NAME);
        makeDeleteGenreRequest(token, this.state.genre.id, this.state.genre.version,this);
        this.hideDelete();
    }

    hideDeleteSuccessModal(){
        this.setState({
            showDeleteSuccessModal: false
            }
        )
    }

    showDelete() {
        this.setState({
            showDeleteConfirm: true

        });
    }

    hideDelete() {
        this.setState({
            showDeleteConfirm: false

        });
    }

    showModify() {
        this.setState({
            showModifyModal: true

        });
    }

    hideModify() {
        this.setState({
            showModifyModal: false

        });
    }

    completeModify(){
        this.hideModify();
        this.reloadUserInfo();
    }

    renderGenreKey(key, value) {
        const {t} = this.props;
        return (
            <Row className={'InfoRow'}>
                <Col className={'InfoLeftColumn'}>{key}:</Col>
                <Col
                    className={'InfoRightColumn'}>{value}</Col>
            </Row>
        )
    }

    renderGenreKeys() {
        return this.state.genre.name ? Object.keys(this.state.genre.name).map(key => {
            return this.renderGenreKey(key, this.state.genre.name[key])
        }) : '';

    }

    renderGenreInfo() {
        const {t} = this.props;
        return (
            <div className="Info">
                <Row className={'Title'}>
                    <Col>{t('UserInfo.Header')} </Col></Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Genre.code')}:</Col>
                    <Col
                        className={'InfoRightColumn'}>{this.state.genre.nameCode}</Col>
                </Row>
                <Row className={'InfoRow'}>
                    <Col className={'InfoLeftColumn'}>{t('Genre.usageCount')}:</Col>
                    <Col
                        className={'InfoRightColumn'}>{this.state.genre.usageCount}</Col>
                </Row>
                <Row className={'Title'}>
                    <Col>{t('Genre.name')} </Col></Row>
                <Row className={'Title'}>
                    <Col className={'InfoLeftColumn ms-3'}>{t('Genre.key')}</Col>
                    <Col className={'InfoRightColumn me-3'}>{t('Genre.value')}</Col>
                </Row>
                {this.state.genre ? this.renderGenreKeys() : ''}
            </div>
        )
    }

    renderOptionBar() {
        const {t} = this.props;
        return (
            <div className={"OptionsPanel mb-5 me-5 "}>
                <Button onClick={this.showDelete.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                        size={'md'}>{t('Genre.Remove')}</Button>
                <Button onClick={!this.state.showModifyModal?this.showModify.bind(this):this.hideModify.bind(this)} className={'m-1 mt-0 mb-0'} variant={'outline-dark'}
                        size={'md'}>{t('Genre.Modify')}</Button>
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
                <Row className={'mb-4'}>
                    <Col className={'w-75'}>
                        {this.state.genre!==''&&this.state.showModifyModal?<GenreModify genre={this.state.genre} onComplete={this.completeModify.bind(this)}/>:''}
                        {this.renderGenreInfo()}
                    </Col>
                </Row>
                <Modal show={this.state.showDeleteConfirm} onHide={this.hideDelete.bind(this)}>
                    <Modal.Header>
                        <Modal.Title>{t('Modal.DeleteConfirm')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{t('Modal.DeleteGenreText')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.removeGenre.bind(this)}
                                variant="outline-dark">{t('Form.Yes')}</Button>
                        <Button onClick={this.hideDelete.bind(this)} variant="outline-dark">{t('Form.No')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showDeleteSuccessModal} onHide={this.hideDeleteSuccessModal.bind(this)} backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Form.Success')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t>{t('Form.GenreDeletedMessage')}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" href={`/?#/genres/`}> {t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.response==='genre_not_exist'}  backdrop={'static'}>
                    <Modal.Header>
                        <Modal.Title>{t('Error.Title')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t>{t(this.state.response)}</t>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" href={`/?#/genres/`}>{t('Form.OK')}</Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

const GenreTr = withTranslation()(GenreNoTr);


export default function Genre() {
    const params = useParams();
    return (
        <GenreTr params={params}/>
    )


}