const signPayloadMock = [
    {
        privateKey: '0x25c1df21c7137410c3f5e231d5740e9962960c97d9ffbd1ef56cabec9cc8cd93',
        payload: '1',
        result: '0x12029cab042f6e9edd6aec8548f4750f292706fe6a55ba8059f0a3ffe3f3ef5010c9f2b85c9370e89074b10ae72f329f37d5bb8c26e91a85b36b4e7232b207dd1b'
    }
]

const encryptionDataMock = [
    {
        passphrase: 'abc',
        payload: 'abc'
    }
]

const hashDataMock = [
    {
        value: '1',
        result: '0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6'
    }
]

module.exports = {
    signPayloadMock,
    encryptionDataMock,
    hashDataMock
}