/* eslint-disable max-len */
const subject = 'Good news!';
const body = `
<div style="width: 100%; height: 60px; background-color: #white; color: white; display: flex; ">
      <div style="margin: auto">
        <img  style="height: 28px;" src="https://cdn-icons-png.flaticon.com/512/358/358103.png" />&nbsp;
        <span style="color: black; font-size: 33px; font-weight: bold;">Fake NFT Cats</span>
      </div>
    </div>
    <div style="text-align:center; margin: 0; padding: 50px; color: #2B2D32; line-height: 16px; font-size: 14px;">
      <span style="font-weight: bold; font-size: 16px">Your offer to own the "<%= asset %>" has been accept, congrats!</span>
      <p style="margin: 30px 0px 40px 0px;"> 
        Click here to check 
      </p>
      <a href="https://example.com" style="box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; padding-top: 12px; display: inline-block; vertical-align: middle; color: white; text-decoration: none; cursor: hover; width: 200px; height: 50px; background-color: #4B0082
; border: none; border-radius: 4px; box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1); font-size: 22px; line-height: 26px; font-weight: 700; ">
        Check
      </a>
    </div>
  </div>
</div></p>
`;

module.exports = {
  subject,
  body,
};
