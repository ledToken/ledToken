pragma solidity ^0.4.22;

contract ContractReceiverOverrider {
  // TODO: create test (In Javascript) checking for this event to make sure
  //       that contracts will override the empty function.
  // This was checked successfully manualy.
  event OverridingTokenFallback(address _from, uint _value, bytes _data);

  function tokenFallback(address _from, uint _value, bytes _data) {
    emit OverridingTokenFallback(_from, _value, _data);
  }
}