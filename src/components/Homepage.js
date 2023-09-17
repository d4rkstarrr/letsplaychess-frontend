import React from 'react'
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import timeFormats from '../config/timeFormats';

const Homepage = () => {

  return (
    <div className="flexContainer">
        <Container>
            <Row>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[0][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[0][0]}</div>
                            <div>{timeFormats[0][1]}</div>
                        </Button>
                    </Link>
                </Col>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[1][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[1][0]}</div>
                            <div>{timeFormats[1][1]}</div>
                        </Button>
                    </Link>
                </Col>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[2][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[2][0]}</div>
                            <div>{timeFormats[2][1]}</div>
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[3][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[3][0]}</div>
                            <div>{timeFormats[3][1]}</div>
                        </Button>
                    </Link>
                </Col>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[4][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[4][0]}</div>
                            <div>{timeFormats[4][1]}</div>
                        </Button>
                    </Link>
                </Col>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[5][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[5][0]}</div>
                            <div>{timeFormats[5][1]}</div>
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[6][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[6][0]}</div>
                            <div>{timeFormats[6][1]}</div>
                        </Button>
                    </Link>
                </Col>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[7][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[7][0]}</div>
                            <div>{timeFormats[7][1]}</div>
                        </Button>
                    </Link>
                </Col>
                <Col className='p-1'>
                    <Link to="/play" state={{ timeFormat: timeFormats[8][0] }}>
                        <Button variant="dark" className='w-100 p-2'>
                            <div>{timeFormats[8][0]}</div>
                            <div>{timeFormats[8][1]}</div>
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Container>
      
    </div>
  )
}

export default Homepage
