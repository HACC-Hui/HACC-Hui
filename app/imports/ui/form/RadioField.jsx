import React from 'react';
import classnames from 'classnames';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

/* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

/* eslint react/prop-types: 0 */
const RadioField = ({
                      allowedValues,
                      checkboxes, // eslint-disable-line no-unused-vars
                      className,
                      disabled,
                      error,
                      errorMessage,
                      id,
                      inline,
                      label,
                      name,
                      onChange,
                      required,
                      showInlineError,
                      transform,
                      value,
                      ...props
                    }) => (
    <div
        className={classnames(className, { disabled, error, inline }, (inline ? '' : 'grouped'), 'fields')}
        {...filterDOMProps(props)}
    >
      {label && (
          <div className={classnames({ required }, 'field')}>
            <label>{label}</label>
          </div>
      )}

      {allowedValues.map(item => (
          <div className="field" key={item}>
            <div className="ui radio checkbox">
              <input
                  checked={item === value}
                  disabled={disabled}
                  id={`${id}-${item}`}
                  name={name}
                  onChange={() => onChange(item)}
                  type="radio"
              />

              <label htmlFor={`${id}-${item}`}>
                {transform ? transform(item) : item}
              </label>
            </div>
          </div>
      ))}

      {!!(error && showInlineError) && (
          <div className="ui red basic pointing label">{errorMessage}</div>
      )}
    </div>
);

export default connectField(RadioField);
