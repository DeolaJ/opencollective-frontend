import React from 'react';
import PropTypes from 'prop-types';

import Link from './Link';
import { FormattedMessage } from 'react-intl';

/**
 * Returns event's parent collective slug. If the parent is not available,
 * fallback on `collective` slug which will result in a valid URL: parent
 * collective slug is only used to generate pretty URLs.
 */
const getEventParentCollectiveSlug = parentCollective => {
  return parentCollective && parentCollective.slug ? parentCollective.slug : 'collective';
};

/**
 * Create a `Link` to the collective based on collective type.
 * It properly deals with type `EVENT` and `isIncognito`
 */
const LinkCollective = ({
  target,
  title,
  collective: { type, slug, name, parentCollective, isIncognito },
  children,
  isNewVersion,
  ...props
}) => {
  if (type === 'USER' && (!name || isIncognito || !slug)) {
    return children || <FormattedMessage id="profile.incognito" defaultMessage="Incognito" />;
  }
  return type !== 'EVENT' ? (
    <Link
      route={isNewVersion ? 'new-collective-page' : 'collective'}
      params={{ slug }}
      {...props}
      title={title}
      target={target}
      passHref
    >
      {children || name || slug}
    </Link>
  ) : (
    <Link
      route="event"
      params={{ eventSlug: slug, parentCollectiveSlug: getEventParentCollectiveSlug(parentCollective) }}
      title={title}
      target={target}
      {...props}
      passHref
    >
      {children || name || slug}
    </Link>
  );
};

LinkCollective.propTypes = {
  /** The collective to link to */
  collective: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    type: PropTypes.string.isRequired,
    isIncognito: PropTypes.bool,
    parentCollective: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
  /** If not given, will render the name of the collective */
  children: PropTypes.node,
  /** Link to the new collective page */
  isNewVersion: PropTypes.bool,
  title: PropTypes.string,
  target: PropTypes.string,
};

export default LinkCollective;
