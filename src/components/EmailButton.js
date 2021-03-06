import Component from 'inferno-component';
import EmailModal from './EmailModal';
import './EmailButton.css';

import {
  supportsMailto,
  supportsLongUrls,
  getMailUrl
} from '../lib/email';

class EmailButton extends Component {
  state = {};

  sendEmail = event => {
    // If both mailto and long URLs are supported
    // If it does not support long URLs, try to copy the body.
    // If mailto is not supported, or if copy failed, show the modal and stop.
    // If mailto is supported and copy succeeded, continue to the email app
    // after showing an alert.

    let copied = false;

    if (!supportsLongUrls && this.el) {
      this.outer.style.display = 'flex';
      this.el.select();
      try { copied = document.execCommand('copy'); } catch (e) {}
      this.outer.style.display = '';
    }

    if (!supportsMailto || !supportsLongUrls) {
      this.setState({ showModal: true, copied });
    }

    if (!supportsMailto || (!supportsLongUrls && !copied)) {
      event.preventDefault();
    } else {
      // We use an alert here to avoid the popup blocker.
      if (copied) alert(this.context.strings.ui.paste_msg);
      this.props.onSend && this.props.onSend('mailto');
    }
  }

  setTextArea = el => this.el = el;
  setOuter = outer => this.outer = outer;

  render() {
    const { disabled } = this.props;
    const url = !disabled && supportsMailto && getMailUrl('mailto', this.props, supportsLongUrls);
    const { showModal, copied } = this.state;
    const { send_email } = this.context.strings.ui;

    return (
      <div className="EmailButton-group">
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          className={`EmailButton ${disabled && 'EmailButton-disabled'}`}
          href={url || null} onClick={!disabled && this.sendEmail}
          target="_blank" tabIndex={disabled ? -1 : 0}
        >{send_email}</a>
        <EmailModal
          show={!!showModal}
          {...this.props}
          setTextArea={this.setTextArea}
          setOuter={this.setOuter}
          copied={copied}
          onClose={() => this.setState({ showModal: false })}
        ></EmailModal>
      </div>
    );
  }
}

export default EmailButton;
