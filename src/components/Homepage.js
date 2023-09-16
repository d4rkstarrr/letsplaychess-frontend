import React from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Homepage = () => {
  return (
    <div className="flexContainer">
        <Container>
            <Row>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>1+0</div>
                        <div>Bullet</div>
                    </Button>
                </Col>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>1+1</div>
                        <div>Bullet</div>
                    </Button>
                </Col>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>1+2</div>
                        <div>Bullet</div>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>5+0</div>
                        <div>Blitz</div>
                    </Button>
                </Col>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>5+3</div>
                        <div>Blitz</div>
                    </Button>
                </Col>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>5+5</div>
                        <div>Blitz</div>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>10+0</div>
                        <div>Rapid</div>
                    </Button>
                </Col>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>10+5</div>
                        <div>Rapid</div>
                    </Button>
                </Col>
                <Col className='p-1'>
                    <Button variant="dark" href="/play" className='w-100 p-2'>
                        <div>10+10</div>
                        <div>Rapid</div>
                    </Button>
                </Col>
            </Row>
        </Container>
      
    </div>
  )
}

export default Homepage
