// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import "./EllipticCurve.sol";

contract PedersenCommitment is EllipticCurve {
    event LogSender(address indexed sender);
    event LogVal(uint256 indexed sender);

    uint256 public SenderRandomPoint;

    //ensure set at most one time
    modifier isPointSet( ){
        require( SenderRandomPoint == 0);
        _;
    }

    function setPoint() public isPointSet
    {
        uint256 randomValue = uint256( keccak256(abi.encodePacked(block.timestamp,msg.sender)));
        SenderRandomPoint = randomValue % mod;
        emit LogSender(msg.sender);
    }

    function getPoint() public returns (uint256)
    {
        emit LogVal(SenderRandomPoint);
        return SenderRandomPoint;
    }

    function commit( uint256 randomValue , uint256 value ) public view returns ( uint256, uint256)
    {
        uint256 x;
        uint256 y; 

        uint256 senderRandomX;
        uint256 senderRandomY;

        uint256 x1;
        uint256 y1;

        uint256 x2;
        uint256 y2;


        (senderRandomX, senderRandomY ) = ellipticMul( SenderRandomPoint, generatorX , generatorY );
        ( x1 , y1 ) = ellipticMul( value , senderRandomX , senderRandomY );
        ( x2 , y2 ) = ellipticMul( randomValue , generatorX , generatorY);
        (x, y) = ellipticAdd(x1, y1, x2, y2);
        return (x,y);
    }

    function verify( uint256 randomValue , uint256 value , uint256 x , uint256 y ) public view returns ( bool )
    {
        uint256 xCheck;
        uint256 yCheck;
        ( xCheck , yCheck ) = commit( randomValue , value );
        if ( (xCheck == x) && ( yCheck == y ) ){
            return true;
        }
        else{
            return false;
        }
    }

    function addCommitment( uint256 randomValue1 ,uint256 x1 , uint256 y1 ,  uint256 randomValue2 , uint256 x2 , uint256 y2 ) public view returns ( uint256, uint256, uint256)
    {
        uint256 randomValue3;
        uint256 x3;
        uint256 y3;

        randomValue3 = addmod(randomValue1,randomValue2, mod);
        (x3, y3 ) = ellipticAdd(x1, y1, x2, y2);

        return (x3, y3, randomValue3);
    }

    function subCommitment( uint256 randomValue1 ,uint256 x1 , uint256 y1 ,  uint256 randomValue2 , uint256 x2 , uint256 y2 ) public view returns ( uint256, uint256, uint256){

        uint256 randomValue3;
        uint256 x3;
        uint256 y3;

         if(randomValue1 < randomValue1 ){
            randomValue3 = mod - (randomValue2 - randomValue1); 
        }else{
            randomValue3 = (randomValue1-randomValue2) % mod;
        }

        ( x3 , y3 ) = ellipticSub(x1, y1, x2, y2);

        return (x3, y3, randomValue3);
          
    }

}